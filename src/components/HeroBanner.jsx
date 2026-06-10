import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requests, fetcher, getImageUrl, API_KEY } from '../services/tmdb';

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
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [trailerModalKey, setTrailerModalKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;
    const fetchHero = async () => {
      try {
        const data = await fetcher(requests.fetchNetflixOriginals);
        const random = data.results[Math.floor(Math.random() * data.results.length)];
        setMovie(random);

        // Fetch trailer for the hero movie
        const details = await fetcher(
          `/tv/${random.id}?api_key=${API_KEY}&language=en-US&append_to_response=videos`
        );
        const ytTrailer = details.videos?.results?.find(
          (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
        ) || details.videos?.results?.find((v) => v.site === 'YouTube');
        if (ytTrailer) {
          setTrailer(ytTrailer);
          // Auto-play after a 3-second delay
          timeoutId = setTimeout(() => {
            setShowVideo(true);
            setAutoPlaying(true);
          }, 3000);
        }
      } catch (err) {
        console.error('Failed to fetch hero:', err);
      }
    };
    fetchHero();
    return () => clearTimeout(timeoutId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  const handlePlayTrailer = (e) => {
    e.stopPropagation();
    if (trailer) {
      // Stop the inline autoplay video
      setAutoPlaying(false);
      setShowVideo(false);
      // Bump the modal key to force a fresh iframe mount
      setTrailerModalKey((k) => k + 1);
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

  if (!movie) {
    return <div className="h-[80vh] bg-zinc-950 animate-pulse"></div>;
  }

  const ytParams = new URLSearchParams({
    autoplay: '1',
    mute: isMuted ? '1' : '0',
    controls: '0',
    showinfo: '0',
    modestbranding: '1',
    loop: '1',
    playlist: trailer?.key || '',
    rel: '0',
    playsinline: '1',
    disablekb: '1',
    iv_load_policy: '3',
    fs: '0',
  });

  return (
    <div className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden">
      {/* Video layer (hidden behind gradient until visible) */}
      {showVideo && trailer && autoPlaying && (
        <div className="absolute inset-0">
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?${ytParams.toString()}`}
            title={`${movie.title || movie.name} Preview`}
            className="w-full h-full object-cover pointer-events-none scale-125"
            allow="autoplay; encrypted-media"
            tabIndex="-1"
          />
        </div>
      )}

      {/* Static backdrop (fades out when video starts) */}
      {!autoPlaying && (
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
      {autoPlaying && (
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
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
            {movie.title || movie.name}
          </h1>
          <p className="text-sm md:text-base text-gray-200 line-clamp-3 drop-shadow">
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
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300 transition"
            >
              ✕ Close
            </button>
            <iframe
              key={trailerModalKey}
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
              title={`${movie?.title || movie?.name} Trailer`}
              className="w-full h-full rounded-lg"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
