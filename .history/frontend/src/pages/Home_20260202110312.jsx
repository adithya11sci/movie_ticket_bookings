import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import MovieCard from '../components/MovieCard';
import { FaSearch, FaFilm, FaTicketAlt, FaCouch, FaStar, FaPlay, FaCreditCard, FaMobileAlt } from 'react-icons/fa';
import './Home.css';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [nowShowing, setNowShowing] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await API.get('/movies');
            const allMovies = res.data;
            setMovies(allMovies);
            // separate now showing and coming soon
            setNowShowing(allMovies.filter(m => m.isNowShowing));
            setComingSoon(allMovies.filter(m => !m.isNowShowing));
        } catch (error) {
            console.log('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            fetchMovies();
            return;
        }
        try {
            const res = await API.get(`/movies/search?query=${searchQuery}`);
            setMovies(res.data);
            setNowShowing(res.data.filter(m => m.isNowShowing));
            setComingSoon(res.data.filter(m => !m.isNowShowing));
        } catch (error) {
            console.log('Search error:', error);
        }
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

            {/* features section with hover effects */}
            <section className="features">
                <div className="feature">
                    <FaFilm className="feature-icon" />
                    <h3>Latest Blockbusters</h3>
                    <p>Experience the newest Hollywood & Bollywood releases on the big screen</p>
                </div>
                <div className="feature">
                    <FaCouch className="feature-icon" />
                    <h3>Premium Seating</h3>
                    <p>Choose from Regular, Premium, or Recliner seats with real-time availability</p>
                </div>
                <div className="feature">
                    <FaCreditCard className="feature-icon" />
                    <h3>Secure Payments</h3>
                    <p>Multiple payment options with bank-grade security for peace of mind</p>
                </div>
            </section>

            {/* now showing section */}
            <section className="movies-section">
                <h2>🎬 Now Showing</h2>
                
                {loading ? (
                    <div className="loading">Loading movies</div>
                ) : nowShowing.length > 0 ? (
                    <div className="movies-grid">
                        {nowShowing.map(movie => (
                            <MovieCard key={movie._id} movie={movie} />
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
                        {comingSoon.map(movie => (
                            <MovieCard key={movie._id} movie={movie} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;

