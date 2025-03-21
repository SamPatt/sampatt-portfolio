import '../App.css';
import Skills from "../components/Skills"
import { useState } from 'react';

function About() {
  const [copyText, setCopyText] = useState('Click to copy');

  const handleCopyEmail = () => {
    // Split email into parts to make it harder for bots to scrape
    const emailParts = ['sam', '@', 'sampatt', '.', 'com'];
    const email = emailParts.join('');
    navigator.clipboard.writeText(email);
    setCopyText('Copied!');
    setTimeout(() => setCopyText('Click to copy'), 2000);
  };

  return (
    <>
      <div className='bio-parent'>
        <div className="bio-container">
          <h2>About Me</h2>
          <p>
            Hello, I'm Sam Patterson. I've evolved from shaping technology policy at a DC think tank to building the future I once wrote about. After authoring one of the first books on Bitcoin and seeing its impact on the cryptocurrency space, I realized I wanted to move from analyzing technology to creating it.
          </p>
          <p>
            After co-founding <a href="https://www.usv.com/writing/2015/06/introducing-ob1/" target="_blank" rel="noopener noreferrer">OB1</a> and helping to build the decentralized marketplace OpenBazaar, I decided to finish getting the skills I needed, and I went on to graduate from the General Assembly Software Engineering Immersive bootcamp.
          </p>
          <p>
            As a fullstack developer, I focus on projects advancing decentralization, self-hosting, privacy, and local LLMs. I'm currently developing a WebRTC-based streaming platform that connects self-hosted LLM operators with users, making AI more accessible while preserving privacy and autonomy.
          </p>
          <p>
            My projects, resume, LinkedIn and Github are all linked. Feel free to send me an email if you'd like to collaborate, hire me, or just to say hello.
          </p>
          <h2>Writing</h2>
          <p>
            My journey in technology spans both analysis and implementation. My 2013 book <i>Bitcoin Beginner</i> helped introduce Bitcoin to mainstream audiences, and I've continued to write about emerging technologies from both policy and technical perspectives.
          </p>
          <p>
            Through my blog and newsletter, I share detailed tutorials on open source tools, development insights from my current projects, and analysis of AI's evolving landscape.
          </p>

          <h2>Contact Me</h2>
          <div className="contact-button" onClick={handleCopyEmail}>
            <div className="contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div className="contact-info">
              {/* Email split into spans to avoid easy scraping */}
              <span>s</span>
              <span>a</span>
              <span>m</span>
              <span>@</span>
              <span>s</span>
              <span>a</span>
              <span>m</span>
              <span>p</span>
              <span>a</span>
              <span>t</span>
              <span>t</span>
              <span>.</span>
              <span>c</span>
              <span>o</span>
              <span>m</span>
              <span className="copy-status">{copyText}</span>
            </div>
          </div>
        </div>
      </div>
      <Skills />
    </>
  );
}

export default About;