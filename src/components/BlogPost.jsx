import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Newsletter from './Newsletter';

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        const publishedModules = import.meta.glob('../content/blog/*.md');
        const draftModules = import.meta.glob('../content/drafts/*.md');
        const allModules = { ...publishedModules, ...draftModules };
        
        const matchingPath = Object.keys(allModules).find(path => 
          path.split('/').pop().replace('.md', '') === slug
        );

        if (matchingPath) {
          const mod = await allModules[matchingPath]();
          setPost({
            slug,
            html: mod.html,
            attributes: mod.attributes,
            isDraft: matchingPath.includes('/drafts/')
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

  // Add IDs to headings and handle anchor links
  useEffect(() => {
    if (post) {
      const content = document.querySelector('.blog-content');
      if (!content) return;

      // First pass: collect all heading texts to handle duplicates
      const headingCounts = {};
      content.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        const baseId = heading.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        headingCounts[baseId] = (headingCounts[baseId] || 0) + 1;
      });

      // Second pass: assign IDs
      content.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        const baseId = heading.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        // If this is a duplicate heading, append a number
        if (headingCounts[baseId] > 1) {
          headingCounts[baseId]--;
          heading.id = `${baseId}-${headingCounts[baseId]}`;
        } else {
          heading.id = baseId;
        }
      });

      // Handle clicks on anchor links
      const handleAnchorClick = (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.slice(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            // Update URL without triggering a scroll
            window.history.pushState(null, '', href);
          }
        }
      };

      content.addEventListener('click', handleAnchorClick);
      return () => content.removeEventListener('click', handleAnchorClick);
    }
  }, [post]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="blog-container">
      <article className="blog-post" style={{ position: 'relative' }}>
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
        <h1>{post.attributes.title}</h1>
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
