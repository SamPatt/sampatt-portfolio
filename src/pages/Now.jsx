import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/ComponentStyles.css';

function Now() {
  const [nowPage, setNowPage] = useState(null);
  const NOW_PAGE_FILENAME = 'Now.md';

  useEffect(() => {
    const loadNowPage = async () => {
      try {
        const noteModules = import.meta.glob('../content/notes/*.md');
        
        // Find the Now.md file
        const nowPagePath = Object.keys(noteModules).find(path => 
          path.split('/').pop() === NOW_PAGE_FILENAME
        );

        if (nowPagePath) {
          const mod = await noteModules[nowPagePath]();
          
          // Process markdown links to handle wiki-style links
          const wikiLinkRegex = /\[\[(.*?)\]\]/g;
          
          // Process all wiki links in the markdown content
          let processedHtml = mod.html;
          const markdownLinks = [...mod.html.matchAll(wikiLinkRegex)];

          // First, load all the linked note titles
          const linkedNotesInfo = {};
          
          // Collect all note slugs from the wiki links
          for (const link of markdownLinks) {
            const linkedSlug = link[1];
            
            // Try to find this note to get its title
            try {
              const notePath = Object.keys(noteModules).find(path => 
                path.split('/').pop().replace('.md', '') === linkedSlug
              );
              
              if (notePath) {
                const linkedMod = await noteModules[notePath]();
                linkedNotesInfo[linkedSlug] = {
                  title: linkedMod.attributes?.title || linkedSlug
                };
              }
            } catch (error) {
              console.error(`Error loading title for ${linkedSlug}:`, error);
              linkedNotesInfo[linkedSlug] = { title: linkedSlug };
            }
          }
          
          // Replace wiki links with proper HTML links
          processedHtml = processedHtml.replace(wikiLinkRegex, (match, slug) => {
            const noteInfo = linkedNotesInfo[slug] || { title: slug };
            return `<a href="/notes/${slug}" class="note-link">${noteInfo.title}</a>`;
          });
          
          setNowPage({
            html: processedHtml,
            attributes: mod.attributes
          });
        } else {
          console.error('Now.md not found. Please create this file in your Obsidian vault with publish: true');
          setNowPage({ 
            html: '<p>Now page not found. Please create a Now.md file in your Obsidian vault with publish: true in the frontmatter.</p>',
            attributes: { title: 'Now' }
          });
        }
      } catch (error) {
        console.error('Error loading Now page:', error);
        setNowPage({ 
          html: '<p>Error loading Now page.</p>',
          attributes: { title: 'Now' }
        });
      }
    };

    loadNowPage();
  }, []);

  // Import useNavigate from React Router
  const navigate = useNavigate();

  // Handle click events for links
  useEffect(() => {
    if (nowPage) {
      const content = document.querySelector('.now-content');
      if (!content) return;

      // Handle heading IDs for anchor links
      content.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        const id = heading.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        heading.id = id;
      });

      // Handle click events
      const handleLinkClick = (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Handle anchor links
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.slice(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', href);
          }
        }
        // Handle internal site links
        else if (href && (
          href.startsWith('/blog/') || 
          href.startsWith('/notes/') || 
          href.startsWith('/projects/') || 
          href === '/blog' || 
          href === '/notes' || 
          href === '/projects' || 
          href === '/about' || 
          href === '/now'
        )) {
          e.preventDefault();
          navigate(href);
        }
        // External links will use default browser behavior (full page load)
      };

      content.addEventListener('click', handleLinkClick);
      return () => content.removeEventListener('click', handleLinkClick);
    }
  }, [nowPage, navigate]);

  if (!nowPage) {
    return <div>Loading...</div>;
  }

  return (
    <div className="note-container">
      <article className="note">
        <h1>{nowPage.attributes.title || 'Now'}</h1>
        
        <div className="date-container">
          {nowPage.attributes.date && (
            <div className="date">
              <span className="date-label">Published: </span>
              {new Date(nowPage.attributes.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC'
              })}
            </div>
          )}
          
          {nowPage.attributes.last_edited && (
            <div className="date modified">
              <span className="date-label">Last updated: </span>
              {new Date(nowPage.attributes.last_edited).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC'
              })}
              {nowPage.attributes.last_edited.includes(':') && (
                <span className="time">
                  {" at "}
                  {new Date(nowPage.attributes.last_edited).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'UTC'
                  })}
                </span>
              )}
            </div>
          )}
        </div>
        
        {nowPage.attributes.tags && nowPage.attributes.tags.length > 0 && (
          <div className="tags">
            {nowPage.attributes.tags.map(tag => (
              <a key={tag} href={`/notes/tags/${tag}`} className="tag">
                #{tag}
              </a>
            ))}
          </div>
        )}
        
        <div 
          className="now-content note-content"
          dangerouslySetInnerHTML={{ __html: nowPage.html }}
        />
      </article>
    </div>
  );
}

export default Now;