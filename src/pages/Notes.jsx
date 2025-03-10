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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 10; // Number of notes to show per page
  
  // Handler for search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // If search is not empty, ensure tags are visible
    if (e.target.value.trim() !== '') {
      setTagListVisible(true);
    }
    // Reset to first page when searching
    setCurrentPage(1);
  };
  const { tag } = useParams();

  const tagThreshold = 10; // Only show tags with more than this number by default

  // State to track current window width for responsive UI
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Track window resize for mobile/desktop layouts
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      
      const mobile = width <= 768;
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
        setCurrentPage(1); // Reset to first page when notes change
        
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
    
  // Pagination logic
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(notes.length / notesPerPage);
  
  // Page navigation handlers
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
    window.scrollTo(0, 0);
  };
  
  const handlePageClick = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    // Adjust max visible pages for mobile/desktop
    const isMobileView = windowWidth <= 480;
    const isVeryNarrow = windowWidth <= 360;
    const maxVisiblePages = isVeryNarrow ? 1 : (isMobileView ? 3 : 5);
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are fewer than maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of the visible page range
      let startPage, endPage;
      
      if (isVeryNarrow) {
        // Extra minimal pagination for very narrow screens
        // Only show current page in the middle (or nothing if at first/last page)
        if (currentPage === 1 || currentPage === totalPages) {
          // Don't show any middle pages if we're at the first or last page
          startPage = totalPages + 1; // This ensures no pages are shown
          endPage = totalPages;       // because startPage > endPage
        } else {
          // Only show current page
          startPage = currentPage;
          endPage = currentPage;
        }
      } else if (isMobileView) {
        // Simpler pagination for mobile - just show current and neighbors
        startPage = Math.max(2, currentPage - 0);
        endPage = Math.min(totalPages - 1, currentPage + 0);
        
        // If we're at the first page, show more next pages
        if (currentPage === 1) {
          endPage = Math.min(totalPages - 1, 2);
        }
        // If we're at the last page, show more previous pages
        else if (currentPage === totalPages) {
          startPage = Math.max(2, totalPages - 1);
        }
      } else {
        // Desktop pagination with more context
        startPage = Math.max(2, currentPage - 1);
        endPage = Math.min(totalPages - 1, currentPage + 1);
        
        // Adjust if we're near the beginning or end
        if (currentPage <= 3) {
          endPage = Math.min(totalPages - 1, 4);
        } else if (currentPage >= totalPages - 2) {
          startPage = Math.max(2, totalPages - 3);
        }
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add the middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

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
            <>
              {currentNotes.map((note) => (
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
                    
                    {note.attributes.rating !== undefined && (
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
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={handlePrevPage} 
                    disabled={currentPage === 1}
                    className="pagination-button"
                    aria-label="Previous page"
                  >
                    ← {windowWidth > 480 ? 'Previous' : ''}
                  </button>
                  
                  <div className="pagination-numbers">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageClick(page)}
                          className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                          aria-label={`Page ${page}`}
                          aria-current={currentPage === page ? 'page' : undefined}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>
                  
                  <button 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                    aria-label="Next page"
                  >
                    {windowWidth > 480 ? 'Next' : ''} →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notes;