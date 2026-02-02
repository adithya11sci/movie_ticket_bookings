import { useState, useEffect } from 'react';
import API from '../api/axios';
import MovieCard from '../components/MovieCard';
import { FaSearch, FaFilter, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
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

    const activeFilterCount = [
        selectedGenre !== 'all',
        selectedLanguage !== 'all',
        priceRange !== 'all',
        preferredTime !== 'all'
    ].filter(Boolean).length;

    return (
        <div className="movies-page">
            {/* Header */}
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
                    
                    <div className="filter-dropdown-container">
                        <button 
                            className={`filter-dropdown-btn ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FaFilter />
                            <span>Filters</span>
                            {activeFilterCount > 0 && (
                                <span className="filter-count">{activeFilterCount}</span>
                            )}
                            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
                        </button>

                        {/* Filter Dropdown Panel */}
                        {showFilters && (
                            <div className="filter-dropdown-panel">
                                <div className="filter-dropdown-header">
                                    <h3>Filter Movies</h3>
                                    {hasActiveFilters && (
                                        <button className="clear-all-btn" onClick={clearAllFilters}>
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                <div className="filter-grid">
                                    {/* Genre Filter */}
                                    <div className="filter-group">
                                        <label>Genre</label>
                                        <select 
                                            value={selectedGenre}
                                            onChange={(e) => setSelectedGenre(e.target.value)}
                                        >
                                            <option value="all">All Genres</option>
                                            {genres.map(genre => (
                                                <option key={genre} value={genre}>{genre}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Language Filter */}
                                    <div className="filter-group">
                                        <label>Language</label>
                                        <select 
                                            value={selectedLanguage}
                                            onChange={(e) => setSelectedLanguage(e.target.value)}
                                        >
                                            <option value="all">All Languages</option>
                                            {languages.map(lang => (
                                                <option key={lang} value={lang}>{lang}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Price Range Filter */}
                                    <div className="filter-group">
                                        <label>Price Range</label>
                                        <select 
                                            value={priceRange}
                                            onChange={(e) => setPriceRange(e.target.value)}
                                        >
                                            <option value="all">All Prices</option>
                                            <option value="budget">₹0 - ₹200</option>
                                            <option value="mid">₹200 - ₹400</option>
                                            <option value="premium">₹400+</option>
                                        </select>
                                    </div>

                                    {/* Preferred Time Filter */}
                                    <div className="filter-group">
                                        <label>Preferred Time</label>
                                        <select 
                                            value={preferredTime}
                                            onChange={(e) => setPreferredTime(e.target.value)}
                                        >
                                            <option value="all">Any Time</option>
                                            <option value="morning">Morning (6AM - 12PM)</option>
                                            <option value="afternoon">Afternoon (12PM - 5PM)</option>
                                            <option value="evening">Evening (5PM - 9PM)</option>
                                            <option value="night">Night (9PM onwards)</option>
                                        </select>
                                    </div>
                                </div>

                                <button 
                                    className="apply-filters-btn"
                                    onClick={() => setShowFilters(false)}
                                >
                                    Apply Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Movies Grid */}
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
    );
};

export default Movies;
