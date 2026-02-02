import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import MovieCard from '../components/MovieCard';
import { FaSearch, FaFilm, FaTicketAlt, FaCouch, FaStar, FaPlay, FaCreditCard, FaMobileAlt } from 'react-icons/fa';
import './Home.css';

// Mock movies for demo when API is unavailable
const MOCK_MOVIES = [
    {
        _id: 'mock1',
        title: 'Avengers: Secret Wars',
        posterUrl: 'https://image.tmdb.org/t/p/w500/t9XkeE7HzOsdQcDDDapDYh8Rrmt.jpg',
        genre: ['Action', 'Sci-Fi', 'Adventure'],
        duration: 180,
        rating: 9.2,
        language: 'English',
        isNowShowing: true,
        description: 'The ultimate battle across the multiverse begins.'
    },
    {
        _id: 'mock2',
        title: 'Pushpa 3: The Rampage',
        posterUrl: 'https://image.tmdb.org/t/p/w500/bBgbH9TOHxmFtlnzr4EONF8bQU1.jpg',
        genre: ['Action', 'Drama', 'Thriller'],
        duration: 175,
        rating: 8.8,
        language: 'Telugu',
        isNowShowing: true,
        description: 'Pushpa returns with more fire and fury.'
    },
    {
        _id: 'mock3',
        title: 'Inception 2',
        posterUrl: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
        genre: ['Sci-Fi', 'Thriller', 'Action'],
        duration: 165,
        rating: 9.0,
        language: 'English',
        isNowShowing: true,
        description: 'Dreams within dreams within dreams.'
    },
    {
        _id: 'mock4',
        title: 'The Dark Knight Returns',
        posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        genre: ['Action', 'Crime', 'Drama'],
        duration: 155,
        rating: 9.5,
        language: 'English',
        isNowShowing: true,
        description: 'The legend rises once more.'
    },
    {
        _id: 'mock5',
        title: 'Avatar 3: The Seed Bearer',
        posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
        genre: ['Sci-Fi', 'Adventure', 'Fantasy'],
        duration: 190,
        rating: 8.5,
        language: 'English',
        isNowShowing: false,
        description: 'Return to Pandora for a new adventure.'
    },
    {
        _id: 'mock6',
        title: 'Spider-Man: Beyond',
        posterUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        duration: 140,
        rating: 8.7,
        language: 'English',
        isNowShowing: false,
        description: 'Miles Morales faces his greatest challenge.'
    }
];

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [allMovies, setAllMovies] = useState([]); // store all movies for filtering
    const [nowShowing, setNowShowing] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDemo, setIsDemo] = useState(false);

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
            if (moviesData && moviesData.length > 0) {
                setMovies(moviesData);
                setAllMovies(moviesData);
                setNowShowing(moviesData.filter(m => m.isNowShowing));
                setComingSoon(moviesData.filter(m => !m.isNowShowing));
            } else {
                // Use mock data if no movies in database
                setMovies(MOCK_MOVIES);
                setAllMovies(MOCK_MOVIES);
                setNowShowing(MOCK_MOVIES.filter(m => m.isNowShowing));
                setComingSoon(MOCK_MOVIES.filter(m => !m.isNowShowing));
                setIsDemo(true);
            }
        } catch (error) {
            console.log('Error fetching movies, using demo data:', error);
            // Use mock data on error
            setMovies(MOCK_MOVIES);
            setAllMovies(MOCK_MOVIES);
            setNowShowing(MOCK_MOVIES.filter(m => m.isNowShowing));
            setComingSoon(MOCK_MOVIES.filter(m => !m.isNowShowing));
            setIsDemo(true);
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
                <h2>🎬 Now Showing {isDemo && <span style={{fontSize: '0.5em', color: '#f84464'}}>(Demo Mode)</span>}</h2>
                
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

