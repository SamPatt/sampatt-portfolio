import { useState } from 'react';
import Project from './Project';
import '../App.css';

const projectsData = [
  {
    id: 1,
    title: 'AUTO-COMPONENT',
    description: 'An npm package which uses AI to help React developers build their UI in a live browser session.',
    year: '2023', 
    type: 'Open Source',
    git: 'https://github.com/TimHuitt/auto-component',
    videoEmbed: '<div class="video-container"><iframe src="https://www.youtube.com/embed/SYhRGkiXS_M?si=mBoCpF_NmSk-djg9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>'
  },
  {
    id: 2,
    title: 'HAVEWORDS.AI',
    description: 'HaveWords is a p2p JS browser app I built using WebRTC, which connects users for a live roleplaying session, guided by AI. This open source app was rebuilt by the excellent JS devs Steve Dekorte and Rich Collins.',
    year: '2023', 
    type: 'Open Source',
    git: 'https://github.com/SamPatt/HaveWords.ai',
    image: 'https://i.imgur.com/FAsLFdN.png'
  },
  {
    id: 3,
    title: 'AILOQUIUM: CYBER PSYCHE REPAIR',
    description: 'Ailoquium is a game set in the near future where AIs are considered conscious beings, and you are a doctor treating them. Built with a Django backend using the Django REST Framework, and a React frontend.',
    year: '2024', 
    type: 'Game',
    git: 'https://github.com/SamPatt/ailoquium'
  },
  {
    id: 4,
    title: 'CLOSE ENCOUNTERS OF THE CUTE KIND',
    description: 'Close Encounters of the Cute Kind is a JavaScript browser game built in one week as a project for my General Assembly Software Engineering Immersive bootcamp.',
    year: '2023', 
    type: 'Game',
    live: 'http://sampatt.github.io/close-encounters-of-the-cute-kind/',
    git: 'https://github.com/SamPatt/close-encounters-of-the-cute-kind',
    image: 'https://github.com/SamPatt/close-encounters-of-the-cute-kind/raw/main/imgs/video.gif'
  },
  {
    id: 5,
    title: 'PAWZBE',
    description: 'Pawzbe is a pet social media platform. User can create accounts using either Google or Github logins, and share photos and updates about their pets with their friends. Built alongside Tim Huitt and Ellie Solhjou.',
    year: '2023', 
    type: 'Social Media',
    git: 'https://github.com/SamPatt/pawzbe'
  }
];

function Projects() {
  const [activeProjectId, setActiveProjectId] = useState(null);

  const handleProjectClick = (projectId) => {
    // Toggle the active project ID, close if the same project is clicked again
    setActiveProjectId(activeProjectId === projectId ? null : projectId);
  };

  return (
    <div className='primary-container'>
      {projectsData.map(project => (
        <div className='project' key={project.id} onClick={() => handleProjectClick(project.id)}>
          <h1>{project.title}</h1>
          {/* If the project is active, display the Project component */}
          {activeProjectId === project.id && <Project project={project} />}
        </div>
      ))}
    </div>
  );
}

export default Projects;
