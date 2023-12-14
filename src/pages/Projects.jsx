import React, { useState } from 'react';
import Project from './Project';
import '../App.css';

const projectsData = [
  {
    id: 1,
    title: 'CLOSE ENCOUNTERS OF THE CUTE KIND',
    description: 'Close Encounters of the Cute Kind is a JavaScript browser game built in one week as a project for my General Assembly Software Engineering Immersive bootcamp.',
    year: '2023', 
    type: 'Game',
    live: 'http://sampatt.com/close-encounters-of-the-cute-kind/',
    git: 'https://github.com/SamPatt/close-encounters-of-the-cute-kind',
    image: 'https://github.com/SamPatt/close-encounters-of-the-cute-kind/raw/main/imgs/video.gif'
  },
  {
    id: 2,
    title: 'HAVEWORDS.AI',
    description: 'HaveWords is a p2p JS browser app I built using WebRTC, which connects users for a live roleplaying session, guided by AI. This open source app was rebuilt by the excellent JS devs Steve Dekorte and Rich Collins.',
    year: '2023', 
    type: 'Open Source',
    live: 'https://havewords.ai/',
    git: 'https://github.com/SamPatt/HaveWords.ai',
    image: 'https://i.imgur.com/FAsLFdN.png'
  },
  {
    id: 3,
    title: 'PAWZBE',
    description: 'Pawzbe is a pet social media platform. User can create accounts using either Google or Github logins, and share photos and updates about their pets with their friends. Built alongside Tim Huitt and Ellie Solhjou.',
    year: '2023', 
    type: 'Social Media',
    live: 'https://pawzbe.com/',
    git: 'https://github.com/SamPatt/pawzbe',
    image: 'https://camo.githubusercontent.com/0eca8aa207366fc386342f309b0cbdbef9c35eb62e977c12e19eb69b93393963/68747470733a2f2f692e696d6775722e636f6d2f4b4b34376d7a572e706e67'
  }
];

function Projects() {
  const [activeProjectId, setActiveProjectId] = useState(null);

  const handleProjectClick = (projectId) => {
    // Toggle the active project ID, close if the same project is clicked again
    setActiveProjectId(activeProjectId === projectId ? null : projectId);
  };

  return (
    <div className='projects-container'>
      {projectsData.map(project => (
        <div key={project.id} onClick={() => handleProjectClick(project.id)}>
          <h1>{project.title}</h1>
          {/* If the project is active, display the Project component */}
          {activeProjectId === project.id && <Project project={project} />}
        </div>
      ))}
    </div>
  );
}

export default Projects;
