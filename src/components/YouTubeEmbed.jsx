import PropTypes from 'prop-types';
import { useMemo } from 'react';
import './ComponentStyles.css';

const buildYouTubeEmbedUrl = (videoId) => {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    color: 'white'
  });

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
};

const YouTubeEmbed = ({ videoId, videoUrl }) => {
  const embedUrl = useMemo(() => buildYouTubeEmbedUrl(videoId), [videoId]);

  return (
    <div className="youtube-embed-container">
      <div className="youtube-embed-aspect">
        <iframe
          className="youtube-embed-player"
          src={embedUrl}
          title="YouTube video player"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <div className="youtube-embed-fallback">
        <a href={videoUrl} target="_blank" rel="noopener noreferrer">
          Watch on YouTube
        </a>
      </div>
    </div>
  );
};

YouTubeEmbed.propTypes = {
  videoId: PropTypes.string.isRequired,
  videoUrl: PropTypes.string.isRequired
};

export default YouTubeEmbed;
