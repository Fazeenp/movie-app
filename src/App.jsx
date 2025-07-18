// App.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import HeroSection from './components/HeroSection';
import { Routes, Route, useNavigate } from 'react-router-dom';
import MovieDetail from './components/MovieDetail';


const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

function Home() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/movie/popular`, API_OPTIONS);
        setMovies(res.data.results);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="bg-[#0f0c29] text-white min-h-screen">
      <HeroSection />

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 border-b border-white/10 pb-2">
          Popular Movies
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="bg-white/5 backdrop-blur-md p-3 rounded-xl shadow-md hover:shadow-xl transition hover:scale-105 cursor-pointer group"
            >
              <div className="aspect-[2/3] overflow-hidden rounded-lg">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              <h2 className="mt-3 text-lg font-semibold line-clamp-1">{movie.title}</h2>
              <p className="text-sm text-gray-400">{movie.release_date}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetail />} />
    </Routes>
    
  );
}

export default App;
