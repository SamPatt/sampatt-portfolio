import '../App.css';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function Project({ project }) {
  return (
    <div className='project-container'>
      
      {/* Render video if videoEmbed is present, otherwise render image */}
      {project.videoEmbed ? (
        <div className='videoParent' dangerouslySetInnerHTML={{ __html: project.videoEmbed }} />
      ) : project.image ? (
        <img src={project.image} alt={project.title} style={{ marginBottom: '2rem' }} />
      ) : null}
          <p>{project.description}</p>

      <div>
        <Link to={project.git}><button>Github</button></Link>
        {project.live && <Link to={project.live}><button>Live</button></Link>}
      </div>
    </div>
  );
}


Project.propTypes = {
  project: PropTypes.shape({
    videoEmbed: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    git: PropTypes.string.isRequired,
    live: PropTypes.string
  }).isRequired
};

export default Project;
