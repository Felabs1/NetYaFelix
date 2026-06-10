import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { requests, getImageUrl } from '../services/tmdb';
import Navbar from '../components/Navbar';
import MovieRow from '../components/MovieRow';

const MovieDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);
  const { data: movie, loading } = useFetch(requests.fetchDetails(type, id));

  const trailer = movie?.videos?.results?.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  ) || movie?.videos?.results?.find(
    (v) => v.site === 'YouTube'
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 animate-pulse">
        <div className="h-[60vh] bg-zinc-800" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-gray-400 text-xl">Content not found</p>
      </div>
    );
  }

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : movie.episode_run_time?.[0]
    ? `${movie.episode_run_time[0]}m per episode`
    : '';

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[60vh] md:h-[70vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${getImageUrl(movie.backdrop_path || movie.poster_path)})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/50 to-transparent" />
        </div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 md:left-12 z-20 bg-black/60 text-white px-4 py-2 rounded hover:bg-black/80 transition"
        >
          ← Back
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-12 flex flex-col md:flex-row gap-6 items-end">
          <img
            src={getImageUrl(movie.poster_path, 'w500')}
            alt={movie.title || movie.name}
            className="hidden md:block w-48 rounded-lg shadow-2xl"
          />
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold">
              {movie.title || movie.name}
            </h1>
            <div className="flex flex-wrap gap-3 text-sm">
              {movie.vote_average && (
                <span className="text-green-400 font-bold">
                  {movie.vote_average.toFixed(1)} match
                </span>
              )}
              {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
              {movie.first_air_date && <span>{movie.first_air_date.slice(0, 4)}</span>}
              {runtime && <span>{runtime}</span>}
              {movie.number_of_seasons && (
                <span>{movie.number_of_seasons} Season{movie.number_of_seasons > 1 ? 's' : ''}</span>
              )}
            </div>
            <div className="flex gap-3">
              {trailer ? (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition"
                >
                  ▶ Play Trailer
                </button>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-2 bg-zinc-600 text-gray-400 px-6 py-2 rounded font-semibold cursor-not-allowed"
                >
                  ▶ No Trailer
                </button>
              )}
              <button className="flex items-center gap-2 bg-gray-600/80 text-white px-4 py-2 rounded font-semibold hover:bg-gray-600 transition">
                + My List
              </button>
            </div>
            <p className="text-sm text-gray-300 line-clamp-3">{movie.overview}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 md:px-12 py-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {movie.genres && (
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1 bg-zinc-800 rounded-full text-xs"
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}
          <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
        </div>
        <div className="text-sm text-gray-400 space-y-2">
          {movie.tagline && (
            <p className="text-gray-300 italic">"{movie.tagline}"</p>
          )}
          {movie.original_language && (
            <p>
              <span className="text-gray-500">Language:</span>{' '}
              {movie.original_language.toUpperCase()}
            </p>
          )}
          {movie.popularity && (
            <p>
              <span className="text-gray-500">Popularity:</span>{' '}
              {movie.popularity.toFixed(0)}
            </p>
          )}
          {movie.production_companies && movie.production_companies.length > 0 && (
            <p>
              <span className="text-gray-500">Studios:</span>{' '}
              {movie.production_companies.map((c) => c.name).join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Cast */}
      {movie.credits?.cast && movie.credits.cast.length > 0 && (
        <div className="px-4 md:px-12 py-6">
          <h2 className="text-xl font-semibold mb-4">Cast</h2>
          <div className="flex gap-4 overflow-x-scroll movie-row">
            {movie.credits.cast.slice(0, 15).map((person) => (
              <div key={person.id} className="flex-shrink-0 w-28 text-center">
                <div className="w-28 h-28 rounded-full overflow-hidden mb-2 bg-zinc-800">
                  {person.profile_path ? (
                    <img
                      src={getImageUrl(person.profile_path, 'w185')}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-2xl">
                      ?
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium truncate">{person.name}</p>
                <p className="text-xs text-gray-500 truncate">{person.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar */}
      <MovieRow
        title="More Like This"
        fetchUrl={requests.fetchSimilar(type, id)}
      />

      {/* Trailer Modal */}
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
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
              title={`${movie.title || movie.name} Trailer`}
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

export default MovieDetail;
