import { useState, useEffect } from 'react';
import { subscribeToNewsletter } from '../utils/listmonk';

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
    <div className="newsletter-container">
      <button className="newsletter-close" onClick={handleClose}>×</button>
      <div className="newsletter-icon">✉️</div>
      <h3>Stay Updated</h3>
      <p>Subscribe to receive the latest posts and updates</p>
      
      <form onSubmit={handleSubmit} className="newsletter-form" style={{ opacity: isLoading ? 0.7 : 1 }}>
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
