import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import { requests } from '../services/tmdb';

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const browse = searchParams.get('browse');

  const allRows = (
    <div className="-mt-32 md:-mt-48 relative z-10 space-y-4 pb-12">
      <MovieRow
        title="NYF Originals"
        fetchUrl={requests.fetchNetflixOriginals}
        isLarge
      />
      <MovieRow title="Trending Now" fetchUrl={requests.fetchTrending} />
      <MovieRow title="Top Rated" fetchUrl={requests.fetchTopRated} />
      <MovieRow title="Action Movies" fetchUrl={requests.fetchActionMovies} />
      <MovieRow title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
      <MovieRow title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} />
      <MovieRow
        title="Romance Movies"
        fetchUrl={requests.fetchRomanceMovies}
      />
      <MovieRow
        title="Documentaries"
        fetchUrl={requests.fetchDocumentaries}
      />
    </div>
  );

  if (browse === 'tv') {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <HeroBanner />
        <div className="-mt-32 md:-mt-48 relative z-10 space-y-4 pb-12">
          <MovieRow
            title="Netflix TV Shows"
            fetchUrl={requests.fetchNetflixOriginals}
            isLarge
          />
          <MovieRow title="Trending TV Shows" fetchUrl={requests.fetchTrending} />
          <MovieRow title="Top Rated TV Shows" fetchUrl={requests.fetchTopRated} />
        </div>
      </div>
    );
  }

  if (browse === 'movies') {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <HeroBanner />
        <div className="-mt-32 md:-mt-48 relative z-10 space-y-4 pb-12">
          <MovieRow title="Trending Movies" fetchUrl={requests.fetchTrending} />
          <MovieRow title="Top Rated Movies" fetchUrl={requests.fetchTopRated} />
          <MovieRow title="Action Movies" fetchUrl={requests.fetchActionMovies} />
          <MovieRow title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
          <MovieRow title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} />
          <MovieRow
            title="Romance Movies"
            fetchUrl={requests.fetchRomanceMovies}
          />
          <MovieRow
            title="Documentaries"
            fetchUrl={requests.fetchDocumentaries}
          />
        </div>
      </div>
    );
  }

  if (browse === 'trending') {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <HeroBanner />
        <div className="-mt-32 md:-mt-48 relative z-10 space-y-4 pb-12">
          <MovieRow title="Trending Now" fetchUrl={requests.fetchTrending} />
          <MovieRow title="Top Rated" fetchUrl={requests.fetchTopRated} />
          <MovieRow title="Popular This Week" fetchUrl={requests.fetchTrending} />
        </div>
      </div>
    );
  }

  if (browse === 'mylist') {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <HeroBanner />
        <div className="-mt-32 md:-mt-48 relative z-10 space-y-4 pb-12">
          <p className="text-gray-400 text-lg px-4 md:px-12 py-8">
            My List is a planned feature — your saved titles will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <HeroBanner />
      {allRows}
    </div>
  );
};

export default HomePage;
