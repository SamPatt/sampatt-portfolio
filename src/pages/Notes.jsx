import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../components/ComponentStyles.css';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState({});
  const { tag } = useParams();

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const notesModules = import.meta.glob('../content/notes/*.md');
        const notesData = await Promise.all(
          Object.keys(notesModules).map(async (path) => {
            const mod = await notesModules[path]();
            return {
              slug: path.split('/').pop().replace('.md', ''),
              html: mod.html,
              attributes: mod.attributes
            };
          })
        );

        // Sort notes by date (newest first)
        notesData.sort((a, b) => 
          new Date(b.attributes.date) - new Date(a.attributes.date)
        );

        // Filter by tag if provided
        const filteredNotes = tag 
          ? notesData.filter(note => note.attributes.tags && note.attributes.tags.includes(tag))
          : notesData;

        setNotes(filteredNotes);
        
        // Collect all tags
        const tagCount = {};
        notesData.forEach(note => {
          if (note.attributes.tags) {
            note.attributes.tags.forEach(noteTag => {
              tagCount[noteTag] = (tagCount[noteTag] || 0) + 1;
            });
          }
        });
        setTags(tagCount);
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    };

    loadNotes();
  }, [tag]);

  return (
    <div className="notes-container">
      <h1>{tag ? `Notes tagged with #${tag}` : 'All Notes'}</h1>
      
      <div className="notes-layout">
        <div className="notes-sidebar">
          <div className="tags-container">
            <h3>Tags</h3>
            <div className="tags-list">
              {Object.entries(tags).map(([tagName, count]) => (
                <Link 
                  key={tagName} 
                  to={`/notes/tags/${tagName}`}
                  className={`tag ${tag === tagName ? 'active' : ''}`}
                >
                  #{tagName} <span className="tag-count">({count})</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="notes-list">
          {notes.length === 0 ? (
            <p>No notes found{tag ? ` with tag #${tag}` : ''}.</p>
          ) : (
            notes.map((note) => (
              <article key={note.slug} className="note-preview">
                <Link to={`/notes/${note.slug}`}>
                  <h2>{note.attributes.title}</h2>
                </Link>
                
                <div className="note-meta">
                  {note.attributes.date && (
                    <span className="date">
                      {new Date(note.attributes.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        timeZone: 'UTC'
                      })}
                    </span>
                  )}
                  
                  {note.attributes.rating && (
                    <span className="rating">
                      Rating: {note.attributes.rating}/5
                    </span>
                  )}
                </div>
                
                {note.attributes.tags && note.attributes.tags.length > 0 && (
                  <div className="tags">
                    {note.attributes.tags.map(noteTag => (
                      <Link key={noteTag} to={`/notes/tags/${noteTag}`} className="tag">
                        #{noteTag}
                      </Link>
                    ))}
                  </div>
                )}
                
                <div className="note-preview-content">
                  {note.html
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
                  {note.html.length > 300 ? '...' : ''}
                </div>
                
                <Link to={`/notes/${note.slug}`} className="read-more">
                  Read More →
                </Link>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Notes;