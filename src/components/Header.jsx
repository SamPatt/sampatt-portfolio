import { NavLink } from "react-router-dom";
import '../App.css';
import resume from '../assets/Patterson_Resume.pdf';

function Header() {
  return (
    <header>
      <h1>Sam Patterson</h1>
      <h4>FULLSTACK DEVELOPER</h4>
      <nav>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
          <div>ABOUT</div>
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>
          <div>PROJECTS</div>
        </NavLink>
        <NavLink to="/blog" className={({ isActive }) => isActive ? 'active' : ''}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            BLOG
            <span 
              role="link"
              onClick={e => {
                e.stopPropagation();
                window.open('/rss.xml', '_blank', 'noopener,noreferrer');
              }}
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                padding: '4px',
                marginLeft: '8px',
                borderRadius: '4px',
                transition: 'background-color 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.stopPropagation();
                e.currentTarget.style.backgroundColor = 'rgba(93, 139, 244, 0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 11a9 9 0 0 1 9 9" />
                <path d="M4 4a16 16 0 0 1 16 16" />
                <circle cx="5" cy="19" r="1" />
              </svg>
            </span>
          </div>
        </NavLink>
        <NavLink to="/notes" className={({ isActive }) => isActive ? 'active' : ''}>
          <div>NOTES</div>
        </NavLink>
        <a href="https://github.com/SamPatt" target="_blank" rel="noopener noreferrer">
          <div>GITHUB</div>
        </a>
        <a href="https://www.linkedin.com/in/sampatt-dev/" target="_blank" rel="noopener noreferrer">
          <div>LINKEDIN</div>
        </a>
        <a href={resume} target="_blank" rel="noopener noreferrer">
          <div>RESUMÉ</div>
        </a>
      </nav>
      <div className="header-background-effect"></div>
    </header>
  );
}

export default Header;