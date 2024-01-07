import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';


function Project({ project }) {
  return (
    <div className='project-container'>
      
      {/* Render video if videoEmbed is present, otherwise render image */}
      {project.videoEmbed ? (
        <div className='videoParent' dangerouslySetInnerHTML={{ __html: project.videoEmbed }} />
        ) : (
          <img src={project.image} alt={project.title} />
          )}
          <p>{project.description}</p>

      <div>
        <Link to={project.git}><button>Github</button></Link>
        <Link to={project.live}><button>Live</button></Link>
      </div>
    </div>
  );
}


export default Project;
