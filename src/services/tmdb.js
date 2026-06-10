const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/';

const requests = {
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213&language=en-US`,
  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28&language=en-US`,
  fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35&language=en-US`,
  fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27&language=en-US`,
  fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749&language=en-US`,
  fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99&language=en-US`,
  fetchSearch: (query) => `/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}`,
  fetchDetails: (type, id) => `/${type}/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos,credits,similar`,
  fetchSimilar: (type, id) => `/${type}/${id}/similar?api_key=${API_KEY}&language=en-US`,
};

const fetcher = async (url) => {
  const response = await fetch(`${BASE_URL}${url}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const getImageUrl = (path, size = 'original') => {
  if (!path) return 'https://via.placeholder.com/500x750/1a1a1a/666?text=No+Image';
  return `${IMG_BASE}${size}${path}`;
};

export { BASE_URL, IMG_BASE, API_KEY, requests, fetcher, getImageUrl };
