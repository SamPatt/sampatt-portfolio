import React from 'react';
import '../App.css';
import Skills from "../components/Skills"

function About() {
  const about = {
    name: "Sam Patterson",
    email: "Contact me: git@sampatt.com",
    bio: `Hello, I'm Sam Patterson. I've always had one foot in the tech world - I launched the technology policy program at a DC think tank, and authored one of the first books written about Bitcoin, but I wanted to be building new things instead of writing about them.

After co-founding <a href="https://www.usv.com/writing/2015/06/introducing-ob1/" target="_blank" rel="noopener noreferrer">OB1</a> and helping to build a decentralized marketplace, I decided to finish get the skills I needed, and I went on to graduate from the General Assembly Software Engineering Immersive bootcamp.

I'm proud of the fullstack skills I've learned and the projects I've created, especially my work with self-hosted AI models; I love working with this new technology. 

My projects, resume, LinkedIn and Github are all linked above. Feel free to send me an email if you'd like to collaborate, or just to say hello.`
  };

  // Function to return JSX for about data
  const loaded = () => (
    <>
    <div className='bio-parent'>
    <div className="bio-container">
      <p dangerouslySetInnerHTML={{ __html: about.bio.split('\n').join('<br />') }}></p>
      <h3>{about.email}</h3>
    </div>
    </div>
    <Skills />
    </>
  );

  return loaded();
}

export default About;
