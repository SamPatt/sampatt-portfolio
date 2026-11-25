import { Link } from 'react-router-dom';
import '../App.css';
import animations from '../content/animations';

function Animations() {
  return (
    <div className="animations-page">
      <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Animations</h4>
      <p className="animations-intro">
        Short data animations about the scale of things in history, science and technology. Made for phones; sound on.
      </p>
      <div className="animations-grid">
        {animations.map((a) => (
          <Link to={`/animations/${a.slug}`} className="animation-card" key={a.slug}>
            <div className="animation-card-poster">
              <img src={a.poster} alt="" loading="lazy" />
              <span className="animation-card-duration">{a.duration}</span>
            </div>
            <div className="animation-card-body">
              <h2 className="animation-card-title">{a.title}</h2>
              <p className="animation-card-summary">{a.summary}</p>
              <span className="animation-card-date">{a.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Animations;
