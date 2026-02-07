import '../App.css';
import PropTypes from 'prop-types';

function Project({ project }) {
  return (
    <div className='project-container' onClick={e => e.stopPropagation()}>
      {project.videoEmbed ? (
        <div className='videoParent' dangerouslySetInnerHTML={{ __html: project.videoEmbed }} />
      ) : project.image ? (
        <img src={project.image} alt={project.title} style={{ maxWidth: '100%', marginBottom: '1rem' }} />
      ) : null}
      <p>{project.description}</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <a href={project.git} target="_blank" rel="noopener noreferrer">
          <button>GitHub</button>
        </a>
        {project.live && (
          <a href={project.live} target="_blank" rel="noopener noreferrer">
            <button>Live</button>
          </a>
        )}
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
