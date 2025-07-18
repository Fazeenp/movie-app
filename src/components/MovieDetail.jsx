import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [movieRes, videoRes, creditsRes, similarRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}`, API_OPTIONS),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/videos`, API_OPTIONS),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, API_OPTIONS),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/similar`, API_OPTIONS),
        ]);

        setMovie(movieRes.data);
        setCast(creditsRes.data.cast.slice(0, 8)); // top 8 cast
        setSimilarMovies(similarRes.data.results.slice(0, 10));

        const trailer = videoRes.data.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (err) {
        console.error("Error fetching details:", err);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) return <div className="text-white text-center py-10">Loading...</div>;

  return (
    <div className="bg-[#0f0c29] text-white min-h-screen px-6 py-10 md:px-16 relative">
      <Link to="/" className="text-sm text-gray-400 hover:text-white">&larr; Back</Link>

      <div className="mt-6 grid md:grid-cols-3 gap-10">
        <motion.img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded-xl shadow-xl w-full max-w-sm mx-auto md:mx-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        />

        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold">{movie.title}</h1>
          <p className="text-gray-400 text-sm">
            {movie.release_date} • {movie.runtime} min • ⭐ {movie.vote_average?.toFixed(1)}
          </p>

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

          <p className="text-gray-300 leading-relaxed">{movie.overview}</p>

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

      {/* Cast */}
        <div className="mt-14">
        <h2 className="text-2xl font-bold mb-4">Cast</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {cast.map((actor) => (
            <div key={actor.id} className="w-[100px] flex-shrink-0 text-center">
                <img
                src={
                    actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : "https://via.placeholder.com/100x150?text=No+Image"
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
                    src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
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
