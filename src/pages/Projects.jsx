import { useState, useEffect } from "react";

function Projects() {
  // create state to hold projects
  const [projects, setProjects] = useState(null);

  //create function to make api call
  const getProjectsData = async () => {

		//make api call and get response
    const response = await fetch("./projects.json");

		// turn response into javascript object
    const data = await response.json();

		// set the projects state to the data
    setProjects(data);

  };

  // make an initial call for the data inside a useEffect, so it only happens once on component load
  useEffect(() => {getProjectsData()}, []);

  // define a function that will return the JSX needed once we get the data
  const loaded = () => {
    return projects.map((project, idx) => (
      <div key={idx} className="project-container">
        <h2>{project.name}</h2>
        <p>{project.description}</p>
        <img src={project.image} />
        <div>
          <a href={project.git}>
            <button>Github</button>
          </a>
          <a href={project.live}>
            <button>Site</button>
        <hr />  
          </a>
        </div>
      </div>
    ));
  };

  return projects ? loaded() : <h2>Loading...</h2>;
}

export default Projects;