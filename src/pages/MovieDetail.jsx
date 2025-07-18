import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// App-wide TMDB API request config
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieDetail = () => {
  const { id } = useParams(); // Extract movie ID from URL
  const [movie, setMovie] = useState(null); // Movie details
  const [cast, setCast] = useState([]); // Movie cast
  const [similarMovies, setSimilarMovies] = useState([]); // Recommended/similar movies
  const [trailerKey, setTrailerKey] = useState(null); // YouTube trailer key
  const [showTrailer, setShowTrailer] = useState(false); // Toggle trailer modal

  // Fetch all data related to the movie on mount or ID change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchMovieDetails = async () => {
      try {
        const [movieRes, videoRes, creditsRes, similarRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}`, API_OPTIONS),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/videos`, API_OPTIONS),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, API_OPTIONS),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/similar`, API_OPTIONS),
        ]);

        setMovie(movieRes.data);
        setCast(creditsRes.data.cast.slice(0, 8)); // Top 8 actors
        setSimilarMovies(similarRes.data.results.slice(0, 10)); // Top 10 recommended

        // Find the first YouTube trailer
        const trailer = videoRes.data.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer) setTrailerKey(trailer.key);
      } catch (err) {
        console.error("Error fetching movie data:", err);
      }
    };

    fetchMovieDetails();
  }, [id]);

  
  // While data is loading, show spinner
  if (!movie) {
    return (
      <div className="fixed inset-0 bg-[#0f0c29] flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-white/40 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0c29] text-white min-h-screen px-6 py-10 md:px-16 relative">
      {/* Back Button */}
      <Link to="/" className="text-sm text-gray-400 hover:text-white">&larr; Back</Link>

      {/* Movie Banner Section */}
      <div className="mt-6 grid md:grid-cols-3 gap-10">
        {/* Movie Poster with fallback */}
        <motion.img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/No-Poster.png"
          }
          alt={movie.title}
          className="rounded-xl shadow-xl w-full max-w-sm mx-auto md:mx-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        />

        {/* Movie Info Section */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold">{movie.title}</h1>

          <p className="text-gray-400 text-sm">
            {movie.release_date} • {movie.runtime} min • ⭐ {movie.vote_average?.toFixed(1)}
          </p>

          {/* Genre Pills */}
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="bg-white/10 text-sm px-3 py-1 rounded-full text-gray-200"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Overview */}
          <p className="text-gray-300 leading-relaxed">{movie.overview}</p>

          {/* Trailer Button */}
          {trailerKey && (
            <button
              onClick={() => setShowTrailer(true)}
              className="inline-block mt-4 px-6 py-2 text-base font-semibold rounded-full bg-gradient-to-r from-pink-600 to-red-500 hover:to-yellow-500 transition duration-300 shadow-lg"
            >
              Watch Trailer
            </button>
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-3xl aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}`}
              className="w-full h-full rounded-xl"
              allowFullScreen
              title="Trailer"
            />
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-2 right-2 text-white text-2xl"
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {/* Cast Section */}
      <div className="mt-14">
        <h2 className="text-2xl font-bold mb-4">Cast</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
          {cast.map((actor) => (
            <div key={actor.id} className="w-[100px] flex-shrink-0 text-center">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : "/No-Poster.png"
                }
                alt={actor.name}
                className="rounded-md w-full h-[150px] object-cover mb-1"
              />
              <p className="text-xs font-medium truncate">{actor.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Movies */}
      <div className="mt-14">
        <h2 className="text-2xl font-bold mb-4">Recommended</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin snap-x snap-mandatory">
          {similarMovies.map((m) => (
            <Link
              to={`/movie/${m.id}`}
              key={m.id}
              className="w-[120px] flex-shrink-0 snap-center"
            >
              <img
                src={
                  m.poster_path
                    ? `https://image.tmdb.org/t/p/w200${m.poster_path}`
                    : "/No-Poster.png"
                }
                alt={m.title}
                className="rounded-lg w-full h-[180px] object-cover hover:scale-105 transition"
              />
              <p className="text-xs mt-2 text-gray-200 truncate text-center">{m.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
