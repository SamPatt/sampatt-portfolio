import { Feed } from 'feed';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BLOG_DIR = path.join(__dirname, '../src/content/blog');
const OUTPUT_DIR = path.join(__dirname, '../dist');

async function generateRSSFeed() {
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
  const blogFiles = fs.readdirSync(BLOG_DIR)
    .filter(file => file.endsWith('.md'));

  for (const file of blogFiles) {
    const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const title = frontmatter.match(/title:\s*(.+)/)?.[1];
      const date = frontmatter.match(/date:\s*['"](.+)['"]/)?.[1];
      const description = frontmatter.match(/description:\s*(.+)/)?.[1];
      
      // Remove frontmatter to get actual content
      const postContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
      
      const slug = file.replace('.md', '');
      const url = `https://sampatt.com/blog/${slug}`;

      feed.addItem({
        title: title?.trim() || 'Untitled',
        id: url,
        link: url,
        description: description?.trim(),
        content: postContent,
        date: date ? new Date(date) : new Date(),
        author: [{
          name: "Sam Patterson",
          link: "https://sampatt.com"
        }]
      });
    }
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write RSS feed
  fs.writeFileSync(path.join(OUTPUT_DIR, 'rss.xml'), feed.rss2());
  fs.writeFileSync(path.join(OUTPUT_DIR, 'feed.json'), feed.json1());
  fs.writeFileSync(path.join(OUTPUT_DIR, 'atom.xml'), feed.atom1());
}

generateRSSFeed().catch(console.error);
