import { useState, useEffect } from 'react';

function Blog() {
  // Add copy functionality for code elements
  useEffect(() => {
    const handleCodeClick = async (e) => {
      if (e.target.tagName === 'CODE') {
        try {
          await navigator.clipboard.writeText(e.target.textContent);
          
          // Visual feedback
          const originalColor = e.target.style.backgroundColor;
          e.target.style.backgroundColor = '#3a3a3a';
          setTimeout(() => {
            e.target.style.backgroundColor = originalColor;
          }, 200);
        } catch (err) {
          console.error('Failed to copy text:', err);
        }
      }
    };

    document.addEventListener('click', handleCodeClick);
    return () => document.removeEventListener('click', handleCodeClick);
  }, []);

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
      {posts.map((post) => (
        <article key={post.slug} className="blog-post">
          <h2>{post.attributes.title}</h2>
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
          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>
      ))}
    </div>
  );
}

export default Blog;
