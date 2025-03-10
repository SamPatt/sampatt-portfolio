import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ComponentStyles.css';

function EmbeddedNote({ slug }) {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNote = async () => {
      try {
        setLoading(true);
        const noteModules = import.meta.glob('../content/notes/*.md');
        
        const matchingPath = Object.keys(noteModules).find(path => 
          path.split('/').pop().replace('.md', '') === slug
        );

        if (matchingPath) {
          const mod = await noteModules[matchingPath]();
          
          // Process wiki links in the HTML
          let processedHtml = mod.html;
          const wikiLinkRegex = /\[\[(.*?)\]\]/g;
          
          while (wikiLinkRegex.exec(mod.html) !== null) {
            const linkedSlug = RegExp.$1;
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
        } else {
          setError(`Note with slug "${slug}" not found.`);
        }
      } catch (error) {
        console.error('Error loading embedded note:', error);
        setError('Failed to load note.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadNote();
    }
  }, [slug]);

  if (loading) {
    return <div className="embedded-note loading">Loading note...</div>;
  }

  if (error) {
    return <div className="embedded-note error">{error}</div>;
  }

  if (!note) {
    return null;
  }

  return (
    <div className="embedded-note">
      <div className="embedded-note-header">
        <div>
          <h3>
            <Link to={`/notes/${note.slug}`}>
              {note.attributes.title}
            </Link>
          </h3>
          
          {note.attributes.rating && (
            <div className="rating">
              Rating: {note.attributes.rating}/5
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
      </div>
      
      {/* Process HTML to prevent nested links */}
      <div 
        className="embedded-note-content"
        dangerouslySetInnerHTML={{ 
          __html: note.html
            // Remove any a tags but keep their content
            .replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1') 
        }}
      />
      
      <Link to={`/notes/${note.slug}`} className="embedded-note-link">
        View full note →
      </Link>
    </div>
  );
}

export default EmbeddedNote;