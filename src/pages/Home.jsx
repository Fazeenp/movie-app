
import { useEffect, useState } from 'react';
import axios from 'axios';
import HeroSection from '../components/HeroSection';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'react-use';
import Search from '../components/Search';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner'
import { getTrendingMovies } from '../../appwrite';
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
    // States
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [trendingMovies, setTrendingMovies] = useState([])
    const [debounceSearchTerm, setDebounceSearchTerm] = useState('');

    // Debounce input
    useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

    const navigate = useNavigate();

    // Fetch movies from API
    const fetchMovies = async (query = '') => {
        try {
            setIsLoading(true);
            setErrorMessage('');

            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const res = await axios.get(endpoint, API_OPTIONS);

            if (res.data?.results?.length > 0) {
                setMovies(res.data.results);
            } else {
                setMovies([]);
                setErrorMessage('No movies found.');
            }
        } catch (err) {
            console.error('Failed to fetch movies:', err);
            setErrorMessage('Error fetching movies.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch movies whenever debounceSearchTerm changes
    useEffect(() => {
        fetchMovies(debounceSearchTerm);
    }, [debounceSearchTerm]);

    //function to fetch the trending or most searched movies
    const loadTrendingMovies = async () => {
        try {
            const movie = await getTrendingMovies();
            setTrendingMovies(movie)
        } catch (error) {
            console.log("Error Fetching movies", error)
        }
    }

    useEffect(() => {
        loadTrendingMovies();
    }, []);
    return (
        <div className="bg-[#0f0c29] text-white min-h-screen relative">
            {/* Floating Search Bar */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>

            {/* Hero Section: Show only when not searching */}
            {searchTerm === '' && (
                <HeroSection />
            )}

            {trendingMovies.length > 0 && (
                <section className="py-10 px-4 sm:px-10 mt-20">
                    <div className="w-full max-w-6xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 border-b border-white/10 pb-2">
                            Trending Movies
                        </h2>

                        <ul className="flex flex-row overflow-y-auto gap-5 -mt-10 w-full hide-scrollbar">
                            {trendingMovies.map((movie, index) => (
                                <li
                                    key={movie.$id}
                                    onClick={() => navigate(`/movie/${movie.movie_id}`)}
                                    className="min-w-[230px] flex flex-row items-center"
                                >
                                    <p className="fancy-text mt-[22px] text-nowrap">
                                        {index + 1}
                                    </p>
                                    <img
                                       onClick={() => navigate(`/movie/${movie.id}`)}
                                        src={movie.poster_url}
                                        alt={movie.title}
                                        title={movie.title}
                                        className=" w-[127px] h-[163px] rounded-lg object-cover -ml-3.5 cursor-pointer"
                                    />
                                    <p className="mt-2 text-sm text-center line-clamp-2">{movie.title}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}


            {/* Movies Section */}
            <section className="max-w-7xl mx-auto px-4 pt-28 pb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 border-b border-white/10 pb-2">
                    {searchTerm ? 'Search Results' : 'Popular Movies'}
                </h1>

                {errorMessage && <p className="text-red-400 mb-4">{errorMessage}</p>}


                {isLoading ? (
                    <div className="flex justify-center pb-5">
                        <Spinner />
                    </div>
                ) : errorMessage ? (
                    <p className="text-white">{errorMessage}</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}


            </section>
        </div>
    );
}

export default Home;
