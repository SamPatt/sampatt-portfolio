import '../App.css';
import { useState, useEffect } from 'react';

function FeedLinks() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const wasHidden = localStorage.getItem('feedLinksHidden');
    if (wasHidden) {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('feedLinksHidden', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="feed-links">
      <button
        className="newsletter-close"
        onClick={handleClose}
        aria-label="Close feed subscription options"
      >
        ×
      </button>
      <h3>Subscribe via RSS</h3>
      <div className="feed-options">
        <a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="feed-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 11a9 9 0 0 1 9 9" />
            <path d="M4 4a16 16 0 0 1 16 16" />
            <circle cx="5" cy="19" r="1" />
          </svg>
          RSS
        </a>
        <a href="/feed.json" target="_blank" rel="noopener noreferrer" className="feed-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
          JSON
        </a>
        <a href="/atom.xml" target="_blank" rel="noopener noreferrer" className="feed-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
          </svg>
          Atom
        </a>
      </div>
    </div>
  );
}

export default FeedLinks;
