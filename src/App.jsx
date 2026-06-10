import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Search from './pages/Search';
import MovieDetail from './pages/MovieDetail';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<Search />} />
      <Route path="/detail/:type/:id" element={<MovieDetail />} />
    </Routes>
  );
};

export default App;
