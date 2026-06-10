import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import MovieRow from "../components/MovieRow";
import { requests } from "../services/tmdb";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <HeroBanner />
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
    </div>
  );
};

export default HomePage;
