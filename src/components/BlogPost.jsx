import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Newsletter from './Newsletter';

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        const modules = import.meta.glob('../content/blog/*.md');
        const matchingPath = Object.keys(modules).find(path => 
          path.split('/').pop().replace('.md', '') === slug
        );

        if (matchingPath) {
          const mod = await modules[matchingPath]();
          setPost({
            slug,
            html: mod.html,
            attributes: mod.attributes
          });
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
      }
    };

    loadBlogPost();
  }, [slug]);

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

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="blog-container">
      <article className="blog-post">
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
      <Newsletter />
    </div>
  );
}

export default BlogPost;
