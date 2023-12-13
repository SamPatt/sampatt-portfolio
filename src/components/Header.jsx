import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header>
      <h1>Sam Patterson</h1>
      <h4>FULLSTACK DEVELOPER</h4>
      <nav>
        <NavLink to="/about" activeClassName="active">
          <div>ABOUT</div>
        </NavLink>
        <NavLink to="/projects" activeClassName="active">
          <div>PROJECTS</div>
        </NavLink>
        <NavLink to="/contact" activeClassName="active">
          <div>CONTACT</div>
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
