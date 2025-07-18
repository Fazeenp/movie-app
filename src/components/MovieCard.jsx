// components/MovieCard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="bg-white/5 backdrop-blur-md p-3 rounded-xl shadow-md hover:shadow-xl transition hover:scale-105 cursor-pointer group"
    >
      <div className="aspect-[2/3] overflow-hidden rounded-lg">
        <img src={movie.poster_path? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`:'/No-Poster.png'} alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <h2 className="mt-3 text-lg font-semibold line-clamp-1">{movie.title}</h2>
      <p className="text-sm text-gray-400">{movie.release_date}</p>
    </div>
  );
};

export default MovieCard;
