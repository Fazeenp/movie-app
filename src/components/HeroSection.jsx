import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Axios config for TMDB API
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const HeroSection = () => {
  const [bgImage, setBgImage] = useState("");
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingMovie = async () => {
      try {
        const res = await axios.get(
          "https://api.themoviedb.org/3/trending/movie/day",
          API_OPTIONS
        );

        const topMovie = res.data.results[0]; // Get top trending movie
        setMovie(topMovie);

        const path = topMovie?.backdrop_path || topMovie?.poster_path;
        setBgImage(
          path
            ? `https://image.tmdb.org/t/p/original${path}`
            : "https://via.placeholder.com/1920x1080?text=No+Image+Available"
        );
      } catch (error) {
        console.error("Error fetching movie:", error);
        setBgImage("https://via.placeholder.com/1920x1080?text=Movie+App");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovie();
  }, []);

  return (
    <section
      className="relative h-screen w-full bg-cover bg-center transition-all duration-700"
      style={{ backgroundImage: bgImage ? `url(${bgImage})` : "none" }}
    >
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10" />

      <div className="relative z-20 h-full flex flex-col md:flex-row items-center justify-center px-6 md:px-16 gap-8 text-white">
        {/* Poster image for larger screens */}
        {!loading && movie?.poster_path && (
          <motion.img
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-40 md:w-60 rounded-lg shadow-2xl hidden md:block"
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-xl text-center md:text-left"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-md">
            {loading ? "Loading..." : movie?.title || "CineScope"}
          </h1>

          <p className="mt-4 text-lg md:text-xl text-gray-300">
            {loading
              ? "Fetching today's top movie..."
              : `${movie?.release_date?.slice(0, 4) || "N/A"} • ⭐ ${movie?.vote_average?.toFixed(1) || "N/A"}`}
          </p>

          <p className="mt-3 text-sm md:text-base text-gray-400 line-clamp-3">
            {movie?.overview ||
              "Explore trending movies and discover your next favorite watch."}
          </p>

          {/* Navigate to trailer page */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/movie/${movie?.id}`)}
            className="mt-6 inline-block px-6 py-2 text-base font-semibold rounded-full bg-gradient-to-r from-pink-600 to-red-500 hover:to-yellow-500 transition duration-300 shadow-lg"
          >
            Watch Trailer
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
