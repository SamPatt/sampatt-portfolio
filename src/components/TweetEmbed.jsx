import { useEffect, useRef } from 'react';

const WIDGET_SCRIPT_SRC = 'https://platform.twitter.com/widgets.js';
let widgetsPromise = null;

const ensureWidgetsScript = () => {
  if (typeof window === 'undefined') return Promise.resolve(null);

  if (window.twttr && window.twttr.widgets) {
    return Promise.resolve(window.twttr);
  }

  if (widgetsPromise) {
    return widgetsPromise;
  }

  widgetsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${WIDGET_SCRIPT_SRC}"]`);
    const resolveWhenReady = (twttr) => {
      if (!twttr) {
        resolve(null);
        return;
      }

      if (typeof twttr.ready === 'function') {
        twttr.ready(() => resolve(twttr));
      } else {
        resolve(twttr);
      }
    };

    if (existingScript) {
      if (window.twttr && window.twttr.widgets) {
        resolveWhenReady(window.twttr);
        return;
      }
      existingScript.addEventListener('load', () => resolveWhenReady(window.twttr));
      existingScript.addEventListener('error', (error) => {
        widgetsPromise = null;
        reject(error);
      });
      return;
    }

    const script = document.createElement('script');
    script.src = WIDGET_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolveWhenReady(window.twttr);
    script.onerror = (error) => {
      widgetsPromise = null;
      reject(error);
    };
    document.body.appendChild(script);
  });

  return widgetsPromise;
};

const TweetEmbed = ({ tweetId, tweetUrl }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const renderFallbackLink = () => {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = '';
      const link = document.createElement('a');
      link.href = tweetUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'View on X';
      containerRef.current.appendChild(link);
    };

    const renderTweet = async () => {
      if (!containerRef.current) return;

      if (!tweetId) {
        renderFallbackLink();
        return;
      }

      try {
        const twttr = await ensureWidgetsScript();
        if (!isMounted || !twttr || !twttr.widgets || !containerRef.current) return;

        containerRef.current.innerHTML = '';
        await twttr.widgets.createTweet(tweetId, containerRef.current, {
          align: 'center',
          dnt: true,
          theme: 'dark'
        });
      } catch (error) {
        console.error('Failed to render tweet embed:', error);
        if (isMounted) {
          renderFallbackLink();
        }
      }
    };

    renderTweet();

    return () => {
      isMounted = false;
    };
  }, [tweetId, tweetUrl]);

  return (
    <div className="tweet-embed-container" ref={containerRef}>
      <a href={tweetUrl} target="_blank" rel="noopener noreferrer">
        {tweetUrl}
      </a>
    </div>
  );
};

export default TweetEmbed;
