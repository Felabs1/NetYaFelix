import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/tmdb';

const MovieCard = ({ movie, mediaType = 'movie' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/detail/${mediaType || movie.media_type || 'movie'}/${movie.id}`);
  };

  return (
    <div
      className="relative flex-shrink-0 w-[160px] md:w-[200px] group cursor-pointer transition-transform duration-200 hover:scale-110 hover:z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="relative aspect-[2/3] rounded overflow-hidden shadow-lg">
        <img
          src={getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title || movie.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-3 transition-opacity">
            <h3 className="text-sm font-semibold mb-1">
              {movie.title || movie.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="text-green-400 font-bold">
                {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
              </span>
              <span>{movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4)}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition text-xs">
                ▶
              </button>
              <button className="w-7 h-7 rounded-full border-2 border-gray-400 text-white flex items-center justify-center hover:border-white transition text-xs">
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
