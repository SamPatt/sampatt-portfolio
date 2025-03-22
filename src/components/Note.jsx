import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ComponentStyles.css';

function Note() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const noteModules = import.meta.glob('../content/notes/*.md');
        
        const matchingPath = Object.keys(noteModules).find(path => 
          path.split('/').pop().replace('.md', '') === slug
        );

        if (matchingPath) {
          const mod = await noteModules[matchingPath]();
          
          // Process markdown links to find related notes
          // Look for [[note-name]] pattern in the HTML
          const wikiLinkRegex = /\[\[(.*?)\]\]/g;
          const linkedSlugs = [];
          let match;
          
          // Process all wiki links in the markdown content
          let processedHtml = mod.html;
          const markdownLinks = [...mod.html.matchAll(wikiLinkRegex)];

          // First, load all the linked note titles
          const linkedNotesInfo = {};
          
          // Collect all note slugs from the wiki links
          for (const link of markdownLinks) {
            const linkedSlug = link[1];
            if (!linkedSlugs.includes(linkedSlug)) {
              linkedSlugs.push(linkedSlug);
              
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
          }
          
          // Now replace wiki links with proper HTML links that show the note title
          processedHtml = processedHtml.replace(wikiLinkRegex, (match, slug) => {
            const noteInfo = linkedNotesInfo[slug] || { title: slug };
            return `<a href="/notes/${slug}" class="note-link">${noteInfo.title}</a>`;
          });
          
          // This approach will simply NOT show the Related Notes section
          // Instead of trying to extract it from the HTML, just leave it in the content
          // The client-side navigation will handle clicks on all internal links
          
          setNote({
            slug,
            html: processedHtml,
            attributes: mod.attributes
          });
        }
      } catch (error) {
        console.error('Error loading note:', error);
      }
    };

    loadNote();
  }, [slug]);

  // We no longer need this function as we're handling links directly in the content

  // Handle note links and headings
  useEffect(() => {
    if (note) {
      const content = document.querySelector('.note-content');
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

      // Handle clicks on all links
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
            // Update URL without triggering a scroll
            window.history.pushState(null, '', href);
          }
        } 
        // Handle note links (internal navigation)
        else if (href && href.startsWith('/notes/')) {
          e.preventDefault();
          
          // Extract the slug from the URL
          const noteSlug = href.replace('/notes/', '');
          
          // Use window.history to navigate without a page reload
          window.history.pushState(null, '', href);
          
          // Instead of a reload, load the new note
          // This will trigger the useEffect that depends on [slug]
          // We need to update the slug param from the router
          if (navigate) {
            navigate(href);
          }
        }
      };

      content.addEventListener('click', handleLinkClick);
      return () => content.removeEventListener('click', handleLinkClick);
    }
  }, [note, navigate]);

  if (!note) {
    return <div>Loading...</div>;
  }

  return (
    <div className="note-container">
      <article className="note">
        <h1>{note.attributes.title}</h1>
        
        <div className="date-container">
          {(note.attributes.created || note.attributes.date) && (
            <div className="date">
              <span className="date-label">Published: </span>
              {new Date(note.attributes.created || note.attributes.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC'
              })}
            </div>
          )}
          
          {note.attributes.last_edited && (
            <div className="date modified">
              <span className="date-label">Last updated: </span>
              {new Date(note.attributes.last_edited).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC'
              })}
              {note.attributes.last_edited.includes(':') && (
                <span className="time">
                  {" at "}
                  {new Date(note.attributes.last_edited).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'UTC'
                  })}
                </span>
              )}
            </div>
          )}
        </div>
        
        {note.attributes.tags && note.attributes.tags.length > 0 && (
          <div className="tags">
            {note.attributes.tags.map(tag => (
              <Link key={tag} to={`/notes/tags/${tag}`} className="tag">
                #{tag}
              </Link>
            ))}
          </div>
        )}
        
        {note.attributes.rating !== undefined && (
          <div className="rating">
            Rating: {note.attributes.rating}/5
          </div>
        )}
        
        <div 
          className="note-content"
          dangerouslySetInnerHTML={{ __html: note.html }}
        />
        
        {/* No longer showing separate related notes section */}
      </article>
    </div>
  );
}

export default Note;