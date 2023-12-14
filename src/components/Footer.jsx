import { Link } from "react-router-dom";
import '../App.css';

function Footer() {
  // Using a similar style as in the Header
  const footerStyle = {
    display: "flex",
    justifyContent: "space-around",
    borderTop: ".2rem solid black",
    padding: ".5rem",
    width: "90%",
    margin: "auto",
  };

  return (
    <footer style={footerStyle}>
      <a href="https://github.com/SamPatt" target="_blank" rel="noopener noreferrer">
        <div>Github</div>
      </a>
      <a href="https://www.linkedin.com/in/sampatt-dev/" target="_blank" rel="noopener noreferrer">
        <div>LinkedIn</div>
      </a>
      <Link to="/other">
        <div>Other</div>
      </Link>
    </footer>
  );
}

export default Footer;
