import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ComponentStyles.css';

function Note() {
  const { slug } = useParams();
  const [note, setNote] = useState(null);
  const [relatedNotes, setRelatedNotes] = useState([]);

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
          
          // Create a processed HTML with proper links
          let processedHtml = mod.html;
          
          // Remove the "Related Notes" section that's in the markdown content
          const relatedNotesRegex = /<h2[^>]*>[\s]*Related Notes[\s]*<\/h2>/i;
          const relatedNotesMatch = processedHtml.match(relatedNotesRegex);
          
          if (relatedNotesMatch) {
            const relatedNotesHeadingIndex = relatedNotesMatch.index;
            
            // Find the end of the section (next h2 or end of content)
            const nextHeadingIndex = processedHtml.indexOf('<h2', relatedNotesHeadingIndex + relatedNotesMatch[0].length);
            if (nextHeadingIndex !== -1) {
              processedHtml = processedHtml.substring(0, relatedNotesHeadingIndex) + 
                             processedHtml.substring(nextHeadingIndex);
            } else {
              processedHtml = processedHtml.substring(0, relatedNotesHeadingIndex);
            }
          }
          
          // Process wiki links
          while ((match = wikiLinkRegex.exec(mod.html)) !== null) {
            const linkedSlug = match[1];
            linkedSlugs.push(linkedSlug);
            
            // Replace wiki links with proper React Router links
            processedHtml = processedHtml.replace(
              `[[${linkedSlug}]]`,
              `<a href="/notes/${linkedSlug}" class="note-link">${linkedSlug}</a>`
            );
          }
          
          setNote({
            slug,
            html: processedHtml,
            attributes: mod.attributes
          });
          
          // Load related notes info if there are any
          if (linkedSlugs.length > 0) {
            loadRelatedNotes(linkedSlugs);
          }
        }
      } catch (error) {
        console.error('Error loading note:', error);
      }
    };

    loadNote();
  }, [slug]);

  const loadRelatedNotes = async (linkedSlugs) => {
    try {
      const noteModules = import.meta.glob('../content/notes/*.md');
      
      const notesData = await Promise.all(
        Object.keys(noteModules)
          .filter(path => {
            const noteSlug = path.split('/').pop().replace('.md', '');
            return linkedSlugs.includes(noteSlug);
          })
          .map(async (path) => {
            const mod = await noteModules[path]();
            return {
              slug: path.split('/').pop().replace('.md', ''),
              title: mod.attributes?.title || path.split('/').pop().replace('.md', '')
            };
          })
      );
      
      setRelatedNotes(notesData);
    } catch (error) {
      console.error('Error loading related notes:', error);
    }
  };

  // Add IDs to headings and handle anchor links
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
  }, [note]);

  if (!note) {
    return <div>Loading...</div>;
  }

  return (
    <div className="note-container">
      <article className="note">
        <h1>{note.attributes.title}</h1>
        
        {note.attributes.date && (
          <div className="date">
            {new Date(note.attributes.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              timeZone: 'UTC'
            })}
          </div>
        )}
        
        {note.attributes.tags && note.attributes.tags.length > 0 && (
          <div className="tags">
            {note.attributes.tags.map(tag => (
              <Link key={tag} to={`/notes/tags/${tag}`} className="tag">
                #{tag}
              </Link>
            ))}
          </div>
        )}
        
        {note.attributes.rating && (
          <div className="rating">
            Rating: {note.attributes.rating}/5
          </div>
        )}
        
        <div 
          className="note-content"
          dangerouslySetInnerHTML={{ __html: note.html }}
        />
        
        {relatedNotes.length > 0 && (
          <div className="related-notes">
            <h3>Related Notes</h3>
            <ul>
              {relatedNotes.map(relatedNote => (
                <li key={relatedNote.slug}>
                  <Link to={`/notes/${relatedNote.slug}`}>
                    {relatedNote.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </div>
  );
}

export default Note;