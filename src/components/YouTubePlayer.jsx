import { useEffect, useRef, useCallback } from 'react';

let apiReady = false;
let apiReadyQueue = [];

const loadYouTubeAPI = () => {
  if (apiReady) return Promise.resolve();
  return new Promise((resolve) => {
    apiReadyQueue.push(resolve);
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  });
};

window.onYouTubeIframeAPIReady = () => {
  apiReady = true;
  apiReadyQueue.forEach((fn) => fn());
  apiReadyQueue = [];
};

const YouTubePlayer = ({ videoId, autoplay, mute, onEnd, controls, className }) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const onEndRef = useRef(onEnd);

  onEndRef.current = onEnd;

  useEffect(() => {
    const id = 'yt-player-' + Math.random().toString(36).slice(2);
    if (!containerRef.current) return;
    containerRef.current.id = id;

    let destroyed = false;

    const createPlayer = () => {
      if (destroyed) return;
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      playerRef.current = new window.YT.Player(id, {
        height: '100%',
        width: '100%',
        videoId,
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          mute: mute ? 1 : 0,
          controls: controls ? 1 : 0,
          showinfo: 0,
          modestbranding: controls ? 0 : 1,
          rel: 0,
          playsinline: 1,
          disablekb: controls ? 0 : 1,
          iv_load_policy: 3,
          fs: controls ? 1 : 0,
          loop: autoplay && !controls ? 1 : 0,
          playlist: autoplay && !controls ? videoId : undefined,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED && onEndRef.current) {
              onEndRef.current();
            }
          },
          onError: (event) => {
            console.error('YouTube player error:', event.data);
          },
        },
      });
    };

    loadYouTubeAPI().then(createPlayer);

    return () => {
      destroyed = true;
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When videoId changes, load the new video into the existing player
  useEffect(() => {
    if (playerRef.current && playerRef.current.loadVideoById) {
      if (autoplay) {
        playerRef.current.loadVideoById(videoId);
      } else {
        playerRef.current.cueVideoById(videoId);
      }
    }
  }, [videoId, autoplay]);

  useEffect(() => {
    if (playerRef.current) {
      if (mute) playerRef.current.mute();
      else playerRef.current.unMute();
    }
  }, [mute]);

  return <div ref={containerRef} className={className} />;
};

export default YouTubePlayer;
