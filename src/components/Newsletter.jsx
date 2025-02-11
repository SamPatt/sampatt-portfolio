import { useState } from 'react';
import { subscribeToNewsletter } from '../utils/listmonk';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="newsletter-container">
      <h3>Subscribe to the Newsletter</h3>
      <p>Get notified when new posts are published</p>
      
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
