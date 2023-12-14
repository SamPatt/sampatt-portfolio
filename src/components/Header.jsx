import { NavLink } from "react-router-dom";
import '../App.css';

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
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>
        <div>CONTACT</div>
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
