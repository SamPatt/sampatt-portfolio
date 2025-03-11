import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Newsletter from '../components/Newsletter';
import FeedLinks from '../components/FeedLinks';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [searchParams] = useSearchParams();
  const showDrafts = searchParams.get('draft') === 'true';

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const publishedModules = import.meta.glob('../content/blog/*.md');
        const draftModules = import.meta.glob('../content/drafts/*.md');
        const modules = showDrafts ? { ...publishedModules, ...draftModules } : publishedModules;
        const posts = await Promise.all(
          Object.keys(modules).map(async (path) => {
            const mod = await modules[path]();
            return {
              slug: path.split('/').pop().replace('.md', ''),
              isDraft: path.includes('/drafts/'),
              html: mod.html,
              attributes: mod.attributes
            };
          })
        );

        // Sort posts by date (falling back to created if date is not available)
        posts.sort((a, b) => {
          const dateA = a.attributes.date || a.attributes.created;
          const dateB = b.attributes.date || b.attributes.created;
          return new Date(dateB) - new Date(dateA);
        });

        setPosts(posts);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      }
    };

    loadBlogPosts();
  }, []);

  return (
    <div className="blog-container">
      <Newsletter />
      <FeedLinks />
      {posts.map((post) => (
        <article key={post.slug} className="blog-post" style={{ position: 'relative' }}>
          {post.isDraft && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#ff6b6b',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              Draft
            </div>
          )}
          <Link to={`/blog/${post.slug}`}>
            <h1>{post.attributes.title}</h1>
          </Link>
          <div className="date">
            {new Date(post.attributes.date || post.attributes.created).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              timeZone: 'UTC'
            })}
          </div>
          {post.attributes.description && (
            <p className="description">{post.attributes.description}</p>
          )}
          <div className="blog-preview">
            {post.html
              .replace(/<[^>]+>/g, '') // Remove HTML tags
              .replace(/&quot;/g, '"') // Replace HTML entities
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .split('\n')
              .filter(line => line.trim()) // Remove empty lines
              .slice(0, 2) // Take first two paragraphs
              .join('\n')
              .slice(0, 300) // Limit to 300 characters
            }
            {post.html.length > 300 ? '...' : ''}
          </div>
          <Link to={`/blog/${post.slug}`} className="read-more">
            Read More →
          </Link>
        </article>
      ))}
    </div>
  );
}

export default Blog;
