import { useState, useEffect } from 'react';
import { subscribeToNewsletter } from '../utils/listmonk';
import './ComponentStyles.css'; // Make sure to create this file

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  // Check if newsletter was previously closed
  useEffect(() => {
    const wasHidden = localStorage.getItem('newsletterHidden');
    if (wasHidden) {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('newsletterHidden', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setStatus('');
    
    try {
      await subscribeToNewsletter(email);
      setStatus('Thanks for subscribing! You\'ll receive updates when new posts are published.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="subscription-container newsletter-container">
      <button className="subscription-close" onClick={handleClose}>×</button>
      <div className="subscription-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      </div>
      <h3 className="subscription-title">Stay Updated</h3>
      <p className="subscription-description">Subscribe to receive the latest posts and updates</p>
      
      <form onSubmit={handleSubmit} className="newsletter-form" style={{ opacity: isLoading ? 0.7 : 1 }}>
        <div className="input-button-container">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="newsletter-input"
          />
          <button 
            type="submit" 
            className="newsletter-button"
            disabled={isLoading}
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      </form>
      
      {status && (
        <div className="newsletter-status newsletter-success">
          {status}
        </div>
      )}
      
      {error && (
        <div className="newsletter-status newsletter-error">
          {error}
        </div>
      )}
    </div>
  );
}

export default Newsletter;
