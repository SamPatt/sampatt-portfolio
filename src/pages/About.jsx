import React from 'react';
import '../App.css';
import Skills from "../components/Skills"
import headshot from "../assets/sampatt.jpg"

function About() {
  const about = {
    name: "Sam Patterson",
    email: "Contact me: git@sampatt.com",
    headshot: headshot,
    bio: `I'm a software engineer with more than 10 of years of previous experience with tech startups and non-profits.

I've always had one foot in the tech world - I launched the technology policy program at a DC think tank, and authored one of the first books written about Bitcoin, but I wanted to be building new things instead of writing about them.

After co-founding a tech startup which raised $9m in VC, I decided to finally get the skills I needed, and I went on to graduate from the General Assembly Software Engineering Immersive bootcamp.

I'm proud of the fullstack skills I've learned and the projects I've created, especially those integrating OpenAI's API; I love working with this new technology. 

My projects, resume, LinkedIn and Github are all linked above. Feel free to send me an email if you'd like to collaborate, or just to say hello.`
  };

  // Function to return JSX for about data
  const loaded = () => (
    <>
    <div className='bio-parent'>
    <div className="bio-container">
      <img className='headshot' src={about.headshot} alt={`${about.name}'s headshot`}></img>
      <p>{about.bio.split('\n').map((paragraph, index) => (
        <React.Fragment key={index}>
          {paragraph}
          <br />
        </React.Fragment>
      ))}</p>
      <h3>{about.email}</h3>
    </div>
    </div>
    <Skills />
    </>
  );

  return loaded();
}

export default About;
