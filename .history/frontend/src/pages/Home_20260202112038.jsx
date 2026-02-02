import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import MovieCard from '../components/MovieCard';
import { FaSearch, FaFilm, FaTicketAlt, FaCouch, FaStar, FaPlay, FaCreditCard, FaMobileAlt } from 'react-icons/fa';
import './Home.css';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [allMovies, setAllMovies] = useState([]); // store all movies for filtering
    const [nowShowing, setNowShowing] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchMovies();
    }, []);

    // live search - filter movies as user types
    useEffect(() => {
        if (!searchQuery.trim()) {
            // if search is empty, show all movies
            setNowShowing(allMovies.filter(m => m.isNowShowing));
            setComingSoon(allMovies.filter(m => !m.isNowShowing));
        } else {
            // filter movies based on search query
            const query = searchQuery.toLowerCase();
            const filtered = allMovies.filter(movie => 
                movie.title.toLowerCase().includes(query) ||
                movie.genre?.some(g => g.toLowerCase().includes(query)) ||
                movie.language?.toLowerCase().includes(query) ||
                movie.description?.toLowerCase().includes(query)
            );
            setNowShowing(filtered.filter(m => m.isNowShowing));
            setComingSoon(filtered.filter(m => !m.isNowShowing));
        }
    }, [searchQuery, allMovies]);

    const fetchMovies = async () => {
        try {
            const res = await API.get('/movies');
            const moviesData = res.data;
            setMovies(moviesData);
            setAllMovies(moviesData); // store for filtering
            setNowShowing(moviesData.filter(m => m.isNowShowing));
            setComingSoon(moviesData.filter(m => !m.isNowShowing));
        } catch (error) {
            console.log('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // search is now handled by useEffect above
    };

    return (
        <div className="home">
            {/* hero section with animated background */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Your Cinema Experience Starts Here</h1>
                    <p>Book tickets for the latest blockbusters in seconds. Premium seats, best prices, hassle-free booking.</p>
                    
                    <form className="search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search for movies, genres, or actors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit">
                            <FaSearch /> Search
                        </button>
                    </form>
                </div>
            </section>

            {/* now showing section */}
            <section className="movies-section">
                <h2>🎬 Now Showing</h2>
                
                {loading ? (
                    <div className="loading">Loading movies</div>
                ) : nowShowing.length > 0 ? (
                    <div className="movies-grid">
                        {nowShowing.map((movie, index) => (
                            <MovieCard key={movie._id} movie={movie} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="no-movies">
                        <p>No movies currently showing. Check back soon!</p>
                    </div>
                )}
            </section>

            {/* coming soon section */}
            {comingSoon.length > 0 && (
                <section className="movies-section">
                    <h2>🎥 Coming Soon</h2>
                    <div className="movies-grid">
                        {comingSoon.map((movie, index) => (
                            <MovieCard key={movie._id} movie={movie} index={index} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;

