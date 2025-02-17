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
          <div>BLOG</div>
        </NavLink>
        <a href="https://github.com/SamPatt" target="_blank" rel="noopener noreferrer">
          <div>GITHUB</div>
        </a>
        <a href="https://www.linkedin.com/in/sampatt-dev/" target="_blank" rel="noopener noreferrer">
          <div>LINKEDIN</div>
        </a>
        {/* Adjust the path to the resume file as necessary */}
        <a href={resume} target="_blank" rel="noopener noreferrer">
          <div>RESUMÉ</div>
        </a>
      </nav>
    </header>
  );
}

export default Header;
