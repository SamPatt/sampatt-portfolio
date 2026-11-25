import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../App.css';
import animations from '../content/animations';

function Animation() {
  const { slug } = useParams();
  const a = animations.find((x) => x.slug === slug);

  useEffect(() => {
    if (a) document.title = `${a.title} | Sam Patterson`;
  }, [a]);

  if (!a) {
    return (
      <div className="animation-page">
        <p>That animation doesn&apos;t exist. <Link to="/animations">See all animations</Link>.</p>
      </div>
    );
  }

  return (
    <div className="animation-page">
      <Link to="/animations" className="animation-back">&larr; All animations</Link>
      <h1 className="animation-title">{a.title}</h1>
      <p className="animation-summary">{a.summary}</p>

      <div className="animation-layout">
        <div className="animation-video">
          <video controls playsInline preload="metadata" poster={a.poster}>
            <source src={a.video} type="video/mp4" />
          </video>
        </div>

        <div className="animation-text">
          <h2>How to read it</h2>
          {a.reading.map((p, i) => <p key={i}>{p}</p>)}

          <h2>Data</h2>
          {a.notes.map((p, i) => <p key={i}>{p}</p>)}
          <ul className="animation-sources">
            {a.sources.map((s) => (
              <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>
            ))}
          </ul>

          <div className="animation-links">
            {a.player && (
              <a href={a.player} target="_blank" rel="noopener noreferrer" className="project-card-link">
                Interactive version
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                </svg>
              </a>
            )}
            <a href={a.video} target="_blank" rel="noopener noreferrer" className="project-card-link">
              Video file (MP4)
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" /><path d="M7 7h10v10" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Animation;
