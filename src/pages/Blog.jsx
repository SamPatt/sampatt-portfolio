import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Newsletter from '../components/Newsletter';

function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const modules = import.meta.glob('../content/blog/*.md');
        const posts = await Promise.all(
          Object.keys(modules).map(async (path) => {
            const mod = await modules[path]();
            return {
              slug: path.split('/').pop().replace('.md', ''),
              html: mod.html,
              attributes: mod.attributes
            };
          })
        );

        // Sort posts by date
        posts.sort((a, b) => 
          new Date(b.attributes.date) - new Date(a.attributes.date)
        );

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
      {posts.map((post) => (
        <article key={post.slug} className="blog-post">
          <Link to={`/blog/${post.slug}`}>
            <h2>{post.attributes.title}</h2>
          </Link>
          <div className="date">
            {new Date(post.attributes.date).toLocaleDateString('en-US', {
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
