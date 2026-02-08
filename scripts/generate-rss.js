import { Feed } from 'feed';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import process from 'process';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize markdown parser with similar config to what's used in the website
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
});

const BLOG_DIR = path.join(__dirname, '../src/content/blog');
const OUTPUT_DIR = path.join(__dirname, '../dist');
console.log('RSS Generator: Starting feed generation...');

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function generateRSSFeed() {
  console.log('RSS Generator: Setting up feed configuration...');
  const feed = new Feed({
    title: "Sam Patterson's Blog",
    description: "Thoughts on software development, AI, and technology",
    id: "https://sampatt.com/",
    link: "https://sampatt.com/",
    language: "en",
    favicon: "https://sampatt.com/favicon.ico",
    copyright: `All rights reserved ${new Date().getFullYear()}, Sam Patterson`,
    author: {
      name: "Sam Patterson",
      link: "https://sampatt.com"
    }
  });

  // Read all blog posts
  console.log('RSS Generator: Reading blog posts from:', BLOG_DIR);
  const blogFiles = fs.readdirSync(BLOG_DIR)
    .filter(file => file.endsWith('.md'));
  console.log('RSS Generator: Found', blogFiles.length, 'blog posts');

  // Parse all posts with gray-matter
  const posts = [];
  for (const file of blogFiles) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const { data: frontmatter, content: postContent } = matter(raw);
    const slug = file.replace('.md', '');
    posts.push({ file, slug, frontmatter, postContent });
  }

  for (const { slug, frontmatter, postContent } of posts) {
    const title = frontmatter.title || 'Untitled';
    const description = frontmatter.description || '';
    const image = frontmatter.image || null;
    const date = frontmatter.date;
    const created = frontmatter.created;

    const htmlContent = md.render(postContent);
    const url = `https://sampatt.com/blog/${slug}`;

    const feedItem = {
      title: String(title).trim(),
      id: url,
      link: url,
      description: String(description).trim(),
      content: htmlContent,
      date: date ? new Date(date) : (created ? new Date(created) : new Date()),
      author: [{
        name: "Sam Patterson",
        link: "https://sampatt.com"
      }]
    };

    // Only add image if it's a valid URL
    if (image && String(image).trim().startsWith('http')) {
      feedItem.image = String(image).trim();
    }

    feed.addItem(feedItem);
  }

  // Ensure output directory exists
  console.log('RSS Generator: Ensuring output directory exists:', OUTPUT_DIR);
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write RSS feed
  console.log('RSS Generator: Writing feed files...');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'rss.xml'), feed.rss2());
  fs.writeFileSync(path.join(OUTPUT_DIR, 'feed.json'), feed.json1());
  fs.writeFileSync(path.join(OUTPUT_DIR, 'atom.xml'), feed.atom1());

  // Generate blog post metadata to inject during build
  console.log('RSS Generator: Generating metadata for blog posts...');
  const indexHtml = fs.readFileSync(path.join(OUTPUT_DIR, 'index.html'), 'utf8');
  let blogsData = {};

  // Store metadata for each blog post
  for (const { slug, frontmatter } of posts) {
    const title = String(frontmatter.title || 'Untitled').trim();
    const description = String(frontmatter.description || '').trim();
    const rawImage = frontmatter.image || null;
    const image = rawImage ? String(rawImage).trim() : null;
    blogsData[slug] = { title, description, image };
  }

  console.log(`RSS Generator: Processed metadata for ${Object.keys(blogsData).length} blog posts`);

  // Write the metadata file that will be used by the client
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'blog-metadata.js'),
    `window.BLOG_METADATA = ${JSON.stringify(blogsData)};`
  );

  // Generate per-post HTML files with baked-in meta tags for social media crawlers
  console.log('RSS Generator: Generating per-post HTML files...');
  let generatedCount = 0;

  for (const { slug, frontmatter } of posts) {
    const title = escapeHtml(String(frontmatter.title || 'Untitled').trim());
    const description = escapeHtml(String(frontmatter.description || '').trim());
    const rawImage = frontmatter.image || null;
    const image = rawImage ? escapeHtml(String(rawImage).trim()) : '';
    const url = `https://sampatt.com/blog/${slug}`;

    let postHtml = indexHtml;

    // Replace <title>
    postHtml = postHtml.replace(
      /<title>.*?<\/title>/,
      `<title>${title} - Sam Patterson</title>`
    );

    // Replace og:title
    postHtml = postHtml.replace(
      /<meta property="og:title" content="[^"]*"/,
      `<meta property="og:title" content="${title}"`
    );

    // Replace og:description
    postHtml = postHtml.replace(
      /<meta property="og:description" content="[^"]*"/,
      `<meta property="og:description" content="${description}"`
    );

    // Replace og:url
    postHtml = postHtml.replace(
      /<meta property="og:url" content="[^"]*"/,
      `<meta property="og:url" content="${url}"`
    );

    // Replace og:image
    postHtml = postHtml.replace(
      /<meta property="og:image" content="[^"]*"/,
      `<meta property="og:image" content="${image}"`
    );

    // Replace twitter:title
    postHtml = postHtml.replace(
      /<meta name="twitter:title" content="[^"]*"/,
      `<meta name="twitter:title" content="${title}"`
    );

    // Replace twitter:description
    postHtml = postHtml.replace(
      /<meta name="twitter:description" content="[^"]*"/,
      `<meta name="twitter:description" content="${description}"`
    );

    // Replace twitter:image
    postHtml = postHtml.replace(
      /<meta name="twitter:image" content="[^"]*"/,
      `<meta name="twitter:image" content="${image}"`
    );

    // Replace meta description
    postHtml = postHtml.replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${description}"`
    );

    // Write to dist/blog/{slug}/index.html
    const postDir = path.join(OUTPUT_DIR, 'blog', slug);
    fs.mkdirSync(postDir, { recursive: true });
    fs.writeFileSync(path.join(postDir, 'index.html'), postHtml);
    generatedCount++;
  }

  console.log(`RSS Generator: Generated ${generatedCount} per-post HTML files`);
  console.log('RSS Generator: Feed and metadata generation complete!');
}

generateRSSFeed().catch(error => {
  console.error('RSS Generator Error:', error);
  process.exit(1); // Exit with error code to make build fail if RSS generation fails
});
