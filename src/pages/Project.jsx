import React from 'react';
import '../App.css';


function Project({ project }) {
  return (
    <div className='project-container'>
      <p>{project.description}</p>
      <p>{project.year}</p>
      <p>{project.type}</p>
      <img src={project.image} alt={project.title} />

    </div>
  );
}

export default Project;
