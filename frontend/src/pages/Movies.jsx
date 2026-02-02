import { useState, useEffect } from 'react';
import API from '../api/axios';
import MovieCard from '../components/MovieCard';
import { FaSearch, FaFilter } from 'react-icons/fa';
import './Movies.css';

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [genres, setGenres] = useState([]);

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
        } catch (error) {
            console.log('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // filter movies when search or genre changes
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
        
        setFilteredMovies(result);
    }, [searchQuery, selectedGenre, movies]);

    return (
        <div className="movies-page">
            <div className="movies-header">
                <h1>All Movies</h1>
                
                <div className="filters">
                    <div className="search-box">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="genre-filter">
                        <FaFilter />
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
                    <p>No movies found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default Movies;
