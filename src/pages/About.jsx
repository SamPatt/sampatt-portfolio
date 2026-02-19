import '../App.css';
import Skills from "../components/Skills"
import { useState } from 'react';
import { Link } from 'react-router-dom';

function About() {
  const [copyText, setCopyText] = useState('Click to copy');

  const handleCopyEmail = () => {
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
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>About</h4>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', lineHeight: '1.3' }}>
            Technical builder & communicator working at the intersection of AI, decentralization, and privacy.
          </h1>
          <p>
            I'm Sam Patterson. I've been building things at the edge of technology for about 15 years now — started in tech policy at a DC think tank, then co-founded <a href="https://www.usv.com/writing/2015/06/introducing-ob1/" target="_blank" rel="noopener noreferrer">OB1</a> and helped build OpenBazaar, a decentralized marketplace backed by Andreessen Horowitz and Union Square Ventures. Somewhere in there I wrote one of the first books on Bitcoin. More recently I was an Apart Labs Fellow doing AI safety research.
          </p>
          <p>
            These days I build AI-powered tools and write about emerging technology — my posts regularly hit the front page of Hacker News. I'm always looking for interesting problems and good people to work with.
          </p>
          <p>
            Have a look at my <Link to="/resume">resume</Link>, <Link to="/projects">projects</Link>, or <Link to="/portfolio">portfolio</Link> — or just send me an email.
          </p>

          <h2>Contact</h2>
          <div className="contact-button" onClick={handleCopyEmail}>
            <div className="contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div className="contact-info">
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
