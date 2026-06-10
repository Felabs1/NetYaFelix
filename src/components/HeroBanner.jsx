import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { requests, fetcher, getImageUrl, API_KEY } from '../services/tmdb';
import YouTubePlayer from './YouTubePlayer';

const MuteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/>
    <line x1="17" y1="9" x2="23" y2="15"/>
  </svg>
);

const UnmuteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  </svg>
);

const HeroBanner = () => {
  const [moviePool, setMoviePool] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const nextTimeoutRef = useRef(null);

  const movie = moviePool[currentIndex];
  const trailer = movie?.trailer;

  // Build a pool of movies with trailers on mount
  useEffect(() => {
    let cancelled = false;
    const buildPool = async () => {
      try {
        const data = await fetcher(requests.fetchNetflixOriginals);
        const shuffled = [...data.results].sort(() => Math.random() - 0.5);
        const pool = [];

        for (const item of shuffled.slice(0, 15)) {
          if (cancelled) return;
          try {
            const details = await fetcher(
              `/tv/${item.id}?api_key=${API_KEY}&language=en-US&append_to_response=videos`
            );
            const ytTrailer = details.videos?.results?.find(
              (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
            ) || details.videos?.results?.find((v) => v.site === 'YouTube');

            if (ytTrailer) {
              pool.push({ ...item, trailer: ytTrailer });
            }
            if (pool.length >= 6) break;
          } catch {
            // skip movies that fail to fetch details
          }
        }

        if (!cancelled && pool.length > 0) {
          setMoviePool(pool);
          setCurrentIndex(0);
          nextTimeoutRef.current = setTimeout(() => {
            setShowVideo(true);
            setAutoPlaying(true);
          }, 3000);
        }
      } catch (err) {
        console.error('Failed to build hero pool:', err);
      }
    };
    buildPool();
    return () => { cancelled = true; clearTimeout(nextTimeoutRef.current); };
  }, []);

  // Advance to next movie after a random 3-5s delay
  const scheduleNext = useCallback(() => {
    clearTimeout(nextTimeoutRef.current);
    if (moviePool.length <= 1) return;
    const delay = 3000 + Math.random() * 2000;
    nextTimeoutRef.current = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % moviePool.length;
      // Fade out, swap video, fade back in
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 400);
      }, 500);
    }, delay);
  }, [currentIndex, moviePool.length]);

  // Called by YouTubePlayer when a video ends
  const handleVideoEnd = useCallback(() => {
    scheduleNext();
  }, [scheduleNext]);

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  const handlePlayTrailer = (e) => {
    e.stopPropagation();
    if (trailer) {
      clearTimeout(nextTimeoutRef.current);
      setShowTrailer(true);
    } else {
      handleClick();
    }
  };

  const handleClick = () => {
    if (movie) {
      navigate(`/detail/tv/${movie.id}`);
    }
  };

  if (moviePool.length === 0) {
    return <div className="h-[80vh] bg-zinc-950 animate-pulse"></div>;
  }

  return (
    <div className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden">
      {/* Video layer */}
      {showVideo && trailer && autoPlaying && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className="w-full h-full overflow-hidden scale-125">
            <YouTubePlayer
              videoId={trailer.key}
              autoplay
              mute={isMuted}
              onEnd={handleVideoEnd}
              controls={false}
              className="w-full h-full pointer-events-none"
            />
          </div>
        </div>
      )}

      {/* Static backdrop (fades out when video starts, fades back in during transition) */}
      {(!autoPlaying || isTransitioning) && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url(${getImageUrl(movie.backdrop_path)})`,
          }}
        />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

      {/* Mute/Unmute toggle */}
      {autoPlaying && !isTransitioning && (
        <button
          onClick={toggleMute}
          className="absolute right-4 md:right-12 bottom-48 md:bottom-56 z-30 flex items-center gap-2 border border-white/60 text-white px-3 py-1.5 rounded hover:bg-white/10 transition"
        >
          {isMuted ? <MuteIcon /> : <UnmuteIcon />}
          <span className="text-xs font-medium">{isMuted ? 'Muted' : 'Sound'}</span>
        </button>
      )}

      {/* Content */}
      <div className="relative h-full flex items-center px-4 md:px-12">
        <div className="max-w-xl space-y-4">
          <h1
            key={`title-${currentIndex}`}
            className="text-4xl md:text-6xl font-bold drop-shadow-lg transition-opacity duration-500"
          >
            {movie.title || movie.name}
          </h1>
          <p
            key={`overview-${currentIndex}`}
            className="text-sm md:text-base text-gray-200 line-clamp-3 drop-shadow transition-opacity duration-500"
          >
            {movie.overview}
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handlePlayTrailer}
              className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded font-semibold hover:bg-gray-200 transition text-sm md:text-base"
            >
              ▶ Play
            </button>
            <button
              onClick={handleClick}
              className="flex items-center gap-2 bg-gray-500/70 text-white px-6 md:px-8 py-2 md:py-3 rounded font-semibold hover:bg-gray-500/50 transition text-sm md:text-base"
            >
              ℹ More Info
            </button>
          </div>
        </div>
      </div>

      {/* Full Trailer Modal */}
      {showTrailer && trailer && (
        <div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="absolute inset-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-20 bg-black/60 text-white text-xl px-4 py-2 rounded hover:bg-black/80 transition"
            >
              ✕ Close
            </button>
            <YouTubePlayer
              videoId={trailer.key}
              autoplay
              mute={false}
              onEnd={handleVideoEnd}
              controls
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
