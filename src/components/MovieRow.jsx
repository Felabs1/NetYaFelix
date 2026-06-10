import { useRef } from 'react';
import { useFetch } from '../hooks/useFetch';
import MovieCard from './MovieCard';

const MovieRow = ({ title, fetchUrl, isLarge = false }) => {
  const { data, loading, error } = useFetch(fetchUrl);
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="mb-8 px-4 md:px-12">
        <h2 className="text-lg md:text-xl font-semibold mb-3">{title}</h2>
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`flex-shrink-0 ${
                isLarge ? 'w-[200px] md:w-[250px] aspect-[2/3]' : 'w-[160px] md:w-[200px] aspect-[2/3]'
              } bg-zinc-800 rounded animate-pulse`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data?.results) return null;

  const movies = data.results.filter(
    (item) => item.poster_path || item.backdrop_path
  );

  if (movies.length === 0) return null;

  return (
    <div className="mb-6 md:mb-8 group/row">
      <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 px-4 md:px-12">
        {title}
      </h2>
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-20 w-10 md:w-12 bg-black/50 text-white opacity-0 group-hover/row:opacity-100 hover:bg-black/70 transition text-3xl flex items-center justify-center"
        >
          ‹
        </button>
        <div
          ref={rowRef}
          className="movie-row flex gap-2 md:gap-3 overflow-x-scroll px-4 md:px-12 scroll-smooth"
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              mediaType={movie.media_type || (fetchUrl.includes('/tv') ? 'tv' : 'movie')}
            />
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-20 w-10 md:w-12 bg-black/50 text-white opacity-0 group-hover/row:opacity-100 hover:bg-black/70 transition text-3xl flex items-center justify-center"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
