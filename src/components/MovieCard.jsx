// src/components/MovieCard.jsx
const MovieCard = ({ movie, onClick }) => {
  return (
    <div
      onClick={onClick}
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
  );
};

export default MovieCard;
