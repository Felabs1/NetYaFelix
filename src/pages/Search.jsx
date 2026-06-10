import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetcher, requests, getImageUrl } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import Navbar from '../components/Navbar';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams.get('q');

  useEffect(() => {
    const search = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetcher(requests.fetchSearch(query));
        setResults(data.results.filter((item) => item.media_type !== 'person'));
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    };
    search();
  }, [query]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <div className="pt-24 px-4 md:px-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          {query ? `Search results for "${query}"` : 'Search'}
        </h1>

        {loading && (
          <div className="flex gap-3 flex-wrap">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="w-[160px] md:w-[200px] aspect-[2/3] bg-zinc-800 rounded animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && results.length === 0 && (
          <p className="text-gray-400 text-lg">
            {query ? 'No results found. Try a different search term.' : 'Enter a search term above to find movies and TV shows.'}
          </p>
        )}

        {!loading && results.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {results.map((item) => (
              <MovieCard
                key={item.id}
                movie={item}
                mediaType={item.media_type || 'movie'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
