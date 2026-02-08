import '../App.css';

const projectsData = [
  {
    id: 1,
    title: 'GG-GeoJSON',
    description: 'A geography meta database and browser editing tool.',
    year: '2025',
    type: 'JavaScript / GeoJSON',
    git: 'https://github.com/SamPatt/gg-geojson',
    // image: new URL('../assets/projects/gg-geojson.png', import.meta.url).href,
  },
  {
    id: 2,
    title: 'FourNiner',
    description: 'A Geoguessr training tool that connects a browser with Google Street View locations to an Obsidian vault to easily create and train flashcards.',
    year: '2025',
    type: 'JavaScript / Obsidian',
    git: 'https://github.com/SamPatt/fourniner',
    image: 'https://cdn.jsdelivr.net/gh/sampatt/media@main/gifs/fourniner_example.gif',
  },
  {
    id: 3,
    title: 'Shell-Recall',
    description: 'Shell History Timeline — a tool for searching, visualizing, and recalling your shell command history.',
    year: '2025',
    type: 'Python / CLI',
    git: 'https://github.com/SamPatt/shell-recall',
    // image: new URL('../assets/projects/shell-recall.png', import.meta.url).href,
  },
  {
    id: 4,
    title: 'Strapto',
    description: 'Capture and stream outputs from self-hosted AI models in real time. Built in Python with aiortc, the server handles WebRTC connections and bi-directional communication.',
    year: '2024',
    type: 'Python / WebRTC',
    git: 'https://github.com/SamPatt/strapto-server',
    // image: new URL('../assets/projects/strapto.png', import.meta.url).href,
  },
  {
    id: 5,
    title: 'LlamaTrivia',
    description: 'I hooked up a browser trivia game to an LLM to see if it could beat my score.',
    year: '2024',
    type: 'JavaScript / AI',
    git: 'https://github.com/SamPatt/wikitrivia-ai/tree/master',
    videoEmbed: 'https://www.youtube.com/embed/itk5oz_f27M',
  },
  {
    id: 6,
    title: 'LookMa',
    description: 'A React Native Android app that connects your phone to a locally hosted LLM server.',
    year: '2024',
    type: 'React Native',
    git: 'https://github.com/SamPatt/lookma',
    videoEmbed: 'https://www.youtube.com/embed/DY0rSqmzqNs',
  },
  {
    id: 7,
    title: 'Auto-Component',
    description: 'An npm package that uses AI to help React developers build their UI in a live browser session.',
    year: '2023',
    type: 'npm / React / AI',
    git: 'https://github.com/TimHuitt/auto-component',
    videoEmbed: 'https://www.youtube.com/embed/SYhRGkiXS_M?si=mBoCpF_NmSk-djg9',
  },
  {
    id: 8,
    title: 'HaveWords.ai',
    description: 'A peer-to-peer browser app built with WebRTC that connects users for a live AI-guided roleplaying session.',
    year: '2023',
    type: 'WebRTC / P2P',
    git: 'https://github.com/SamPatt/HaveWords.ai',
    image: 'https://i.imgur.com/FAsLFdN.png',
  },
  {
    id: 9,
    title: 'Close Encounters of the Cute Kind',
    description: 'A JavaScript browser game built in one week as a project for the General Assembly Software Engineering Immersive bootcamp.',
    year: '2023',
    type: 'Game / JavaScript',
    git: 'https://github.com/SamPatt/close-encounters-of-the-cute-kind',
    live: 'http://sampatt.github.io/close-encounters-of-the-cute-kind/',
    image: 'https://github.com/SamPatt/close-encounters-of-the-cute-kind/raw/main/imgs/video.gif',
  }
];

function Projects() {
  return (
    <div className="projects-page">
      <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Projects</h4>
      <div className="projects-grid">
        {projectsData.map(project => (
          <div className="project-card" key={project.id}>
            {project.videoEmbed ? (
              <div className="project-card-video">
                <iframe
                  src={project.videoEmbed}
                  title={project.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : project.image ? (
              <div className="project-card-image">
                <img src={project.image} alt={project.title} />
              </div>
            ) : null}
            <div className="project-card-body">
              <div className="project-card-meta">
                <span className="project-card-type">{project.type}</span>
                <span className="project-card-year">{project.year}</span>
              </div>
              <h2 className="project-card-title">{project.title}</h2>
              <p className="project-card-desc">{project.description}</p>
              <div className="project-card-links">
                <a href={project.git} target="_blank" rel="noopener noreferrer" className="project-card-link">
                  GitHub
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                  </svg>
                </a>
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-card-link">
                    Live Demo
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
