import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../components/ComponentStyles.css';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [tagListVisible, setTagListVisible] = useState(!isMobile);
  
  // Handler for search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // If search is not empty, ensure tags are visible
    if (e.target.value.trim() !== '') {
      setTagListVisible(true);
    }
  };
  const { tag } = useParams();

  const tagThreshold = 10; // Only show tags with more than this number by default

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && !tagListVisible) {
        setTagListVisible(true);
      } else if (mobile && tagListVisible && !showAllTags) {
        setTagListVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tagListVisible, showAllTags]);

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

  // Sort tags by count (descending)
  const sortedTags = Object.entries(tags).sort((a, b) => b[1] - a[1]);
  
  // Filter tags based on search
  const filteredTags = sortedTags.filter(([tagName]) => 
    tagName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine which tags to show
  const tagsToShow = showAllTags || searchTerm.trim() !== ''
    ? filteredTags
    : filteredTags.filter(([_, count]) => count >= tagThreshold);

  return (
    <div className="notes-container">
      <h1>{tag ? `Notes tagged with #${tag}` : 'All Notes'}</h1>
      
      <div className="notes-layout">
        <div className="notes-sidebar">
          <div className="tags-container">
            <div className="tags-header">
              <h3>Tags</h3>
              <button 
                className="tags-toggle-button"
                onClick={() => setTagListVisible(!tagListVisible)}
              >
                {tagListVisible ? 'Hide' : 'Show'}
              </button>
            </div>

            {tagListVisible && (
              <>
                <div className="tags-search">
                  <input
                    type="text"
                    placeholder="Search tags..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="tags-search-input"
                  />
                </div>
                
                <div className="tags-list">
                  {tagsToShow.map(([tagName, count]) => (
                    <Link 
                      key={tagName} 
                      to={`/notes/tags/${tagName}`}
                      className={`tag ${tag === tagName ? 'active' : ''}`}
                    >
                      #{tagName} <span className="tag-count">({count})</span>
                    </Link>
                  ))}
                </div>
                
                {!showAllTags && searchTerm.trim() === '' && filteredTags.length > tagsToShow.length && (
                  <button 
                    className="show-more-tags"
                    onClick={() => setShowAllTags(true)}
                  >
                    Show {filteredTags.length - tagsToShow.length} more tags
                  </button>
                )}
                
                {showAllTags && searchTerm.trim() === '' && (
                  <button 
                    className="show-less-tags"
                    onClick={() => setShowAllTags(false)}
                  >
                    Show fewer tags
                  </button>
                )}
              </>
            )}
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