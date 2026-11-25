import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../App.css';
import animations from '../content/animations';

// Full-screen interactive player, outside the site layout (no header or sidebar).
function Animation() {
  const { slug } = useParams();
  const a = animations.find((x) => x.slug === slug);

  useEffect(() => {
    if (a) document.title = `${a.title} | Sam Patterson`;
  }, [a]);

  if (!a) {
    return (
      <div className="animation-missing">
        <p>That animation doesn&apos;t exist. <Link to="/animations">See all animations</Link>.</p>
      </div>
    );
  }

  return (
    <div className="animation-fullscreen">
      <iframe src={a.player} title={a.title} allow="autoplay; fullscreen" />
    </div>
  );
}

export default Animation;
