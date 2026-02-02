import { useState, useEffect } from 'react';
import API from '../api/axios';
import MovieCard from '../components/MovieCard';
import { FaSearch, FaFilter, FaTimes, FaSlidersH } from 'react-icons/fa';
import './Movies.css';

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [selectedLanguage, setSelectedLanguage] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [preferredTime, setPreferredTime] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await API.get('/movies');
            setMovies(res.data);
            setFilteredMovies(res.data);
            
            // extract unique genres from movies
            const allGenres = res.data.flatMap(m => m.genre || []);
            const uniqueGenres = [...new Set(allGenres)];
            setGenres(uniqueGenres);

            // extract unique languages
            const allLanguages = res.data.map(m => m.language).filter(Boolean);
            const uniqueLanguages = [...new Set(allLanguages)];
            setLanguages(uniqueLanguages);
        } catch (error) {
            console.log('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // filter movies when search or filters change
    useEffect(() => {
        let result = movies;
        
        // filter by search
        if (searchQuery) {
            result = result.filter(m => 
                m.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        // filter by genre
        if (selectedGenre !== 'all') {
            result = result.filter(m => 
                m.genre?.includes(selectedGenre)
            );
        }

        // filter by language
        if (selectedLanguage !== 'all') {
            result = result.filter(m => 
                m.language === selectedLanguage
            );
        }
        
        setFilteredMovies(result);
    }, [searchQuery, selectedGenre, selectedLanguage, priceRange, preferredTime, movies]);

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedGenre('all');
        setSelectedLanguage('all');
        setPriceRange('all');
        setPreferredTime('all');
    };

    const hasActiveFilters = searchQuery || selectedGenre !== 'all' || selectedLanguage !== 'all' || priceRange !== 'all' || preferredTime !== 'all';

    return (
        <div className="movies-page">
            <div className="movies-content">
                {/* Main Content */}
                <div className="movies-main">
                    <div className="movies-header">
                        <div className="header-left">
                            <h1>All Movies</h1>
                            <p className="results-text">{filteredMovies.length} movies found</p>
                        </div>
                        
                        <div className="header-controls">
                            <div className="search-box">
                                <FaSearch />
                                <input
                                    type="text"
                                    placeholder="Search movies..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button className="clear-search" onClick={() => setSearchQuery('')}>
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                            
                            <button 
                                className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <FaSlidersH />
                                <span>Filters</span>
                                {hasActiveFilters && <span className="filter-badge"></span>}
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading">Loading movies...</div>
                    ) : filteredMovies.length > 0 ? (
                        <div className="movies-grid">
                            {filteredMovies.map(movie => (
                                <MovieCard key={movie._id} movie={movie} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-movies">
                            <FaFilter />
                            <h3>No Movies Found</h3>
                            <p>No movies match your current filters.</p>
                            <button onClick={clearAllFilters}>Clear Filters</button>
                        </div>
                    )}
                </div>

                {/* Filter Sidebar */}
                <aside className={`filter-sidebar ${showFilters ? 'show' : ''}`}>
                    <div className="filter-header">
                        <h3><FaFilter /> Filters</h3>
                        {hasActiveFilters && (
                            <button className="clear-all-btn" onClick={clearAllFilters}>
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="filter-section">
                        <h4>Genre</h4>
                        <div className="filter-options">
                            <label className={`filter-option ${selectedGenre === 'all' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="genre"
                                    checked={selectedGenre === 'all'}
                                    onChange={() => setSelectedGenre('all')}
                                />
                                <span>All Genres</span>
                            </label>
                            {genres.map(genre => (
                                <label 
                                    key={genre} 
                                    className={`filter-option ${selectedGenre === genre ? 'active' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="genre"
                                        checked={selectedGenre === genre}
                                        onChange={() => setSelectedGenre(genre)}
                                    />
                                    <span>{genre}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <h4>Language</h4>
                        <div className="filter-options">
                            <label className={`filter-option ${selectedLanguage === 'all' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="language"
                                    checked={selectedLanguage === 'all'}
                                    onChange={() => setSelectedLanguage('all')}
                                />
                                <span>All Languages</span>
                            </label>
                            {languages.map(lang => (
                                <label 
                                    key={lang} 
                                    className={`filter-option ${selectedLanguage === lang ? 'active' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="language"
                                        checked={selectedLanguage === lang}
                                        onChange={() => setSelectedLanguage(lang)}
                                    />
                                    <span>{lang}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <h4>Price Range</h4>
                        <div className="filter-options">
                            <label className={`filter-option ${priceRange === 'all' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="price"
                                    checked={priceRange === 'all'}
                                    onChange={() => setPriceRange('all')}
                                />
                                <span>All Prices</span>
                            </label>
                            <label className={`filter-option ${priceRange === 'budget' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="price"
                                    checked={priceRange === 'budget'}
                                    onChange={() => setPriceRange('budget')}
                                />
                                <span>₹0 - ₹200</span>
                            </label>
                            <label className={`filter-option ${priceRange === 'mid' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="price"
                                    checked={priceRange === 'mid'}
                                    onChange={() => setPriceRange('mid')}
                                />
                                <span>₹200 - ₹400</span>
                            </label>
                            <label className={`filter-option ${priceRange === 'premium' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="price"
                                    checked={priceRange === 'premium'}
                                    onChange={() => setPriceRange('premium')}
                                />
                                <span>₹400+</span>
                            </label>
                        </div>
                    </div>

                    <div className="filter-section">
                        <h4>Preferred Time</h4>
                        <div className="filter-options">
                            <label className={`filter-option ${preferredTime === 'all' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="time"
                                    checked={preferredTime === 'all'}
                                    onChange={() => setPreferredTime('all')}
                                />
                                <span>Any Time</span>
                            </label>
                            <label className={`filter-option ${preferredTime === 'morning' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="time"
                                    checked={preferredTime === 'morning'}
                                    onChange={() => setPreferredTime('morning')}
                                />
                                <span>Morning (6AM - 12PM)</span>
                            </label>
                            <label className={`filter-option ${preferredTime === 'afternoon' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="time"
                                    checked={preferredTime === 'afternoon'}
                                    onChange={() => setPreferredTime('afternoon')}
                                />
                                <span>Afternoon (12PM - 5PM)</span>
                            </label>
                            <label className={`filter-option ${preferredTime === 'evening' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="time"
                                    checked={preferredTime === 'evening'}
                                    onChange={() => setPreferredTime('evening')}
                                />
                                <span>Evening (5PM - 9PM)</span>
                            </label>
                            <label className={`filter-option ${preferredTime === 'night' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="time"
                                    checked={preferredTime === 'night'}
                                    onChange={() => setPreferredTime('night')}
                                />
                                <span>Night (9PM onwards)</span>
                            </label>
                        </div>
                    </div>

                    <button className="apply-filters-btn" onClick={() => setShowFilters(false)}>
                        Apply Filters
                    </button>
                </aside>

                {/* Overlay for mobile */}
                {showFilters && <div className="filter-overlay" onClick={() => setShowFilters(false)}></div>}
            </div>
        </div>
    );
};

export default Movies;
