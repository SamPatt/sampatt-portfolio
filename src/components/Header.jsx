import { NavLink } from "react-router-dom";
import '../App.css';
import resume from '../assets/Patterson_Resume.pdf';

function Header() {
  return (
    <header>
      <NavLink to="/about" style={{ textDecoration: 'none' }}>
        <h1>Sam Patterson</h1>
      </NavLink>
      <p style={{
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        fontFamily: 'var(--font-mono)',
        marginTop: '0.25rem',
        letterSpacing: '0.02em'
      }}>Developer &amp; Writer</p>
      <nav>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
          <div>About</div>
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>
          <div>Projects</div>
        </NavLink>
        <NavLink to="/portfolio" className={({ isActive }) => isActive ? 'active' : ''}>
          <div>Portfolio</div>
        </NavLink>
        <NavLink to="/blog" className={({ isActive }) => isActive ? 'active' : ''}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Blog
            <span
              role="link"
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                window.open('/rss.xml', '_blank', 'noopener,noreferrer');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                opacity: 0.4,
                transition: 'opacity 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.stopPropagation();
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '0.4';
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 11a9 9 0 0 1 9 9" />
                <path d="M4 4a16 16 0 0 1 16 16" />
                <circle cx="5" cy="19" r="1" />
              </svg>
            </span>
          </div>
        </NavLink>
        <NavLink to="/notes" className={({ isActive }) => isActive ? 'active' : ''}>
          <div>Notes</div>
        </NavLink>
        <NavLink to="/now" className={({ isActive }) => isActive ? 'active' : ''}>
          <div>Now</div>
        </NavLink>
        <hr style={{
          border: 'none',
          borderTop: '1px solid var(--border-color)',
          margin: '0.5rem 0.75rem',
          padding: 0
        }} />
        <a href="https://github.com/SamPatt" target="_blank" rel="noopener noreferrer">
          <div>GitHub</div>
        </a>
        <a href="https://www.linkedin.com/in/sampatt-dev/" target="_blank" rel="noopener noreferrer">
          <div>LinkedIn</div>
        </a>
        <a href={resume} target="_blank" rel="noopener noreferrer">
          <div>Resume</div>
        </a>
      </nav>
    </header>
  );
}

export default Header;
