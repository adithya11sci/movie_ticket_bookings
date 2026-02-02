import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import MovieCard from '../components/MovieCard';
import { FaSearch, FaFilm, FaTicketAlt, FaCouch } from 'react-icons/fa';
import './Home.css';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await API.get('/movies');
            setMovies(res.data);
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
        } catch (error) {
            console.log('Search error:', error);
        }
    };

    return (
        <div className="home">
            {/* hero section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Book Your Movie Tickets</h1>
                    <p>Experience the magic of cinema with our easy booking system</p>
                    
                    <form className="search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search movies by title or genre..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit">
                            <FaSearch /> Search
                        </button>
                    </form>
                </div>
            </section>

            {/* features section */}
            <section className="features">
                <div className="feature">
                    <FaFilm className="feature-icon" />
                    <h3>Latest Movies</h3>
                    <p>Watch the newest releases in theaters</p>
                </div>
                <div className="feature">
                    <FaCouch className="feature-icon" />
                    <h3>Choose Your Seats</h3>
                    <p>Select your preferred seats easily</p>
                </div>
                <div className="feature">
                    <FaTicketAlt className="feature-icon" />
                    <h3>Instant Booking</h3>
                    <p>Get your tickets in seconds</p>
                </div>
            </section>

            {/* now showing section */}
            <section className="movies-section">
                <h2>Now Showing</h2>
                
                {loading ? (
                    <div className="loading">Loading movies...</div>
                ) : movies.length > 0 ? (
                    <div className="movies-grid">
                        {movies.map(movie => (
                            <MovieCard key={movie._id} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <div className="no-movies">
                        <p>No movies found. Try a different search.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
