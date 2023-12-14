import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';


function Project({ project }) {
  return (
    <div className='project-container'>
      <p>{project.description}</p>
      <img src={project.image} alt={project.title} />
      <div>
      <Link to={project.git}><button>Github</button></Link>
      <Link to={project.live}><button>Live</button></Link>
      </div>


    </div>
  );
}

export default Project;
