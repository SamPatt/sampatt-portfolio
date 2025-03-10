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
          
          // Process content to support note embedding
          let processedHtml = mod.html;
          const noteEmbedRegex = /\{\{note:([a-zA-Z0-9-]+)\}\}/g;
          let embedMatches = [...processedHtml.matchAll(noteEmbedRegex)];
          
          // Replace note embed tags with placeholders
          embedMatches.forEach((match, index) => {
            const noteSlug = match[1];
            const placeholder = `<div id="embedded-note-${index}" data-note-slug="${noteSlug}"></div>`;
            processedHtml = processedHtml.replace(match[0], placeholder);
          });
          
          setPost({
            slug,
            html: processedHtml,
            embedMatches: embedMatches.map(match => match[1]),
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

  // Handle embedded notes
  useEffect(() => {
    if (post && post.embedMatches && post.embedMatches.length > 0) {
      // Import the EmbeddedNote component lazily to avoid circular imports
      const renderEmbeddedNotes = async () => {
        // Wait a tick to ensure the DOM is fully rendered
        await new Promise(resolve => setTimeout(resolve, 0));
        
        post.embedMatches.forEach((noteSlug, index) => {
          const placeholder = document.getElementById(`embedded-note-${index}`);
          if (placeholder && placeholder.childNodes.length === 0) {
            // Create a container for the embedded note
            const container = document.createElement('div');
            container.className = 'embedded-note-container';
            placeholder.appendChild(container);
            
            try {
              // Create a self-contained element to avoid context issues
              container.innerHTML = `
                <div class="embedded-note">
                  <div class="embedded-note-header">
                    <h3>
                      <a href="/notes/${noteSlug}" class="embedded-note-title">Loading note...</a>
                    </h3>
                  </div>
                  <div class="embedded-note-content">
                    <p>Loading...</p>
                  </div>
                  <a href="/notes/${noteSlug}" class="embedded-note-link">
                    View full note →
                  </a>
                </div>
              `;
              
              // Now fetch the note data directly
              const fetchNote = async () => {
                try {
                  const noteModules = import.meta.glob('../content/notes/*.md');
                  const matchingPath = Object.keys(noteModules).find(path => 
                    path.split('/').pop().replace('.md', '') === noteSlug
                  );
                  
                  if (matchingPath) {
                    const mod = await noteModules[matchingPath]();
                    const titleElement = container.querySelector('.embedded-note-title');
                    const contentElement = container.querySelector('.embedded-note-content');
                    
                    if (titleElement) {
                      titleElement.textContent = mod.attributes.title || noteSlug;
                    }
                    
                    if (contentElement) {
                      // Process HTML to remove headings but keep links working
                      const processedHtml = mod.html
                        .replace(/<h1[^>]*>.*?<\/h1>/gi, '') // Remove h1
                        // Keep external links functioning, but replace wiki links with spans
                        .replace(/\[\[(.*?)\]\]/g, '<span class="wiki-link">$1</span>');
                      
                      contentElement.innerHTML = processedHtml;
                      
                      // Add click handlers for wiki links
                      const wikiLinks = contentElement.querySelectorAll('.wiki-link');
                      wikiLinks.forEach(link => {
                        link.addEventListener('click', () => {
                          window.location.href = `/notes/${link.textContent.trim()}`;
                        });
                      });
                    }
                    
                    // Add the title to its container
                    if (titleElement && mod.attributes.title) {
                      const titleContainer = document.createElement('div');
                      titleContainer.className = 'title-container';
                      
                      // Move the title into the container
                      const headerElement = container.querySelector('.embedded-note-header');
                      const titleParent = titleElement.parentNode;
                      titleContainer.appendChild(titleElement);
                      titleParent.appendChild(titleContainer);
                      
                      // Add rating if available
                      if (mod.attributes.rating) {
                        const ratingElement = document.createElement('div');
                        ratingElement.className = 'rating';
                        ratingElement.textContent = `Rating: ${mod.attributes.rating}/5`;
                        titleContainer.appendChild(ratingElement);
                      }
                    }
                    
                    // Add tags if available
                    if (mod.attributes.tags && mod.attributes.tags.length > 0) {
                      const headerElement = container.querySelector('.embedded-note-header');
                      const tagsElement = document.createElement('div');
                      tagsElement.className = 'tags';
                      
                      mod.attributes.tags.forEach(tag => {
                        const tagLink = document.createElement('a');
                        tagLink.href = `/notes/tags/${tag}`;
                        tagLink.className = 'tag';
                        tagLink.textContent = `#${tag}`;
                        tagsElement.appendChild(tagLink);
                      });
                      
                      headerElement.appendChild(tagsElement);
                    }
                  }
                } catch (error) {
                  console.error('Error loading note:', error);
                  const contentElement = container.querySelector('.embedded-note-content');
                  if (contentElement) {
                    contentElement.innerHTML = '<p>Error loading note.</p>';
                  }
                }
              };
              
              fetchNote();
            } catch (error) {
              console.error('Error rendering embedded note:', error);
            }
          }
        });
      };
      
      renderEmbeddedNotes();
    }
  }, [post]);

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
