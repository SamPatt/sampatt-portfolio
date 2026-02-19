import '../App.css';

const experience = [
  {
    title: 'Co-Founder & Head of Operations',
    company: 'OB1 (OpenBazaar)',
    period: '2015 – 2020',
    location: 'Remote',
    bullets: [
      'Co-founded and helped build OpenBazaar, an open-source decentralized marketplace using Bitcoin for peer-to-peer commerce',
      'Raised $9M in venture capital from Andreessen Horowitz and Union Square Ventures',
      'Served as developer advocate and documentation lead, managing a global open-source community',
      'Featured in Wired, Forbes, Yahoo Finance; presented at conferences in Prague, Guatemala, New Hampshire'
    ]
  },
  {
    title: 'Senior Policy Analyst & Research Fellow',
    company: 'Stand Together',
    period: '2011 – 2015',
    location: 'Washington DC',
    bullets: [
      'Founded and directed the technology policy program',
      'Conducted research on how technology policy affects individual well-being',
      'Created the Crony Chronicles project, a public awareness initiative on political cronyism'
    ]
  },
  {
    title: 'Freelance Technical Writer & Voiceover Artist',
    company: null,
    period: '2020 – Present',
    location: 'Remote',
    bullets: [
      'Technical tutorials and educational content for open-source projects',
      'Recorded and published audiobooks on Audible',
      'Blog writing with multiple Hacker News front-page hits'
    ]
  }
];

const writing = [
  {
    title: 'o3 Beats a Master-Level GeoGuessr Player — Even with Fake EXIF Data',
    note: '#1 on Hacker News',
    link: '/blog/2025-04-28-can-o3-beat-a-geoguessr-master'
  },
  {
    title: 'My Grandma Was a Fed — Lessons from Digitizing Hundreds of Hours of Childhood',
    note: 'Hacker News front page',
    link: '/blog/2025-12-13-my-grandma-was-a-fed-lessons-from-digitizing-hundreds-of-hours-of-childhood'
  },
  {
    title: 'Visualizing Why Bitcoin Can\'t Work Over HF Radio',
    note: 'Interactive visualization + video',
    link: '/blog/2025-11-08-visualizing-why-bitcoin-cant-work-over-hf-radio'
  },
  {
    title: 'Artificial Advocates: Biasing Democratic Feedback Using AI',
    note: '3rd place, Apart Hackathon — led to Apart Labs Fellowship',
    link: '/portfolio'
  },
  {
    title: 'Bitcoin Beginner',
    note: 'One of the first books published about Bitcoin (2013)',
    link: 'https://www.amazon.com/gp/product/B077BKQFYK/ref=dbs_a_def_rwt_bibl_vppi_i0'
  },
  {
    title: 'Breakdown of All Satoshi\'s Writings',
    note: 'Analysis with accompanying video',
    link: '/blog/2019-06-06-satoshi-analysis'
  }
];

const presentations = [
  'Hacker\'s Congress, Paralelní Polis (Prague)',
  'CryptoEcon Conference (Saigon)',
  'Hillsdale College Free Market Forum',
  'PorcFest XIII (New Hampshire)',
  'Universidad Francisco Marroquín (Guatemala)',
  'Liberty.me'
];

const skills = [
  'Python', 'JavaScript', 'React', 'Node.js', 'PostgreSQL',
  'Linux', 'Git', 'AI/LLM Integration', 'WebRTC',
  'Self-hosted Infrastructure', 'Technical Writing', 'Developer Advocacy'
];

function Resume() {
  return (
    <div className="primary-container">
      <div className="resume-container">

        <div className="resume-header">
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Resume</h4>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Sam Patterson</h1>
          <p className="resume-tagline">Technical Builder & Communicator</p>
          <div className="resume-contact">
            <span>Grand Rapids, MI</span>
            <span className="resume-sep">·</span>
            <span>sam@sampatt.com</span>
            <span className="resume-sep">·</span>
            <a href="https://www.linkedin.com/in/sampatt-dev/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span className="resume-sep">·</span>
            <a href="https://github.com/SamPatt" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>

        <p className="resume-summary">
          I've spent 15 years building at the intersection of technology, communication, and community — from 
          founding a tech policy program in DC, to co-founding a venture-backed decentralized marketplace, to 
          writing about Bitcoin before most people had heard of it. Today I build AI-powered tools and write 
          about emerging technology, regularly reaching the front page of Hacker News.
        </p>

        <section className="resume-section">
          <h2>Experience</h2>
          {experience.map((job, i) => (
            <div key={i} className="resume-job">
              <div className="resume-job-header">
                <div>
                  <h3>{job.title}</h3>
                  {job.company && <span className="resume-company">{job.company}</span>}
                </div>
                <div className="resume-job-meta">
                  <span>{job.period}</span>
                  <span className="resume-location">{job.location}</span>
                </div>
              </div>
              <ul>
                {job.bullets.map((bullet, j) => (
                  <li key={j}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="resume-section">
          <h2>Selected Writing & Research</h2>
          <div className="resume-writing">
            {writing.map((item, i) => (
              <div key={i} className="resume-writing-item">
                <a href={item.link} target={item.link.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
                  {item.title}
                </a>
                <span className="resume-writing-note">{item.note}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="resume-section">
          <h2>Technical Skills</h2>
          <div className="resume-skills">
            {skills.map((skill, i) => (
              <span key={i} className="resume-skill-tag">{skill}</span>
            ))}
          </div>
        </section>

        <section className="resume-section">
          <h2>Education</h2>
          <div className="resume-education">
            <div className="resume-edu-item">
              <strong>General Assembly</strong> — Full-Stack Software Engineering Immersive
              <span className="resume-edu-year">2024</span>
            </div>
            <div className="resume-edu-item">
              <strong>Alfred University</strong> — B.A. Political Science
              <span className="resume-edu-year">2010</span>
            </div>
          </div>
        </section>

        <section className="resume-section">
          <h2>Presentations</h2>
          <p className="resume-presentations">
            {presentations.join(' · ')}
          </p>
        </section>

      </div>
    </div>
  );
}

export default Resume;
