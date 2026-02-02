/**
 * ManageMovies.jsx
 * Admin page for movie management with proper UI
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { 
    FaPlus, 
    FaEdit, 
    FaTrash, 
    FaArrowLeft,
    FaFilm,
    FaStar,
    FaClock,
    FaLanguage,
    FaCalendarAlt,
    FaSearch
} from 'react-icons/fa';
import './AdminPages.css';

const ManageMovies = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    
    // form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        genre: '',
        duration: '',
        language: '',
        releaseDate: '',
        posterUrl: '',
        rating: ''
    });

    useEffect(() => {
        fetchMovies();
    }, []);

    useEffect(() => {
        // Filter movies based on search
        const filtered = movies.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.genre.join(', ').toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.language.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMovies(filtered);
    }, [movies, searchTerm]);

    const fetchMovies = async () => {
        try {
            const res = await API.get('/movies');
            setMovies(res.data);
            setFilteredMovies(res.data);
        } catch (error) {
            toast.error('Failed to load movies');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const movieData = {
                ...formData,
                genre: formData.genre.split(',').map(g => g.trim()),
                duration: Number(formData.duration),
                rating: Number(formData.rating)
            };

            if (editingMovie) {
                await API.put(`/movies/${editingMovie._id}`, movieData);
                toast.success('Movie updated!');
            } else {
                await API.post('/movies', movieData);
                toast.success('Movie added!');
            }
            
            setShowModal(false);
            setEditingMovie(null);
            resetForm();
            fetchMovies();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save movie');
        }
    };

    const handleEdit = (movie) => {
        setEditingMovie(movie);
        setFormData({
            title: movie.title,
            description: movie.description,
            genre: movie.genre.join(', '),
            duration: movie.duration.toString(),
            language: movie.language,
            releaseDate: movie.releaseDate?.split('T')[0] || '',
            posterUrl: movie.posterUrl,
            rating: movie.rating?.toString() || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this movie?')) return;
        
        try {
            await API.delete(`/movies/${id}`);
            toast.success('Movie deleted');
            fetchMovies();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            genre: '',
            duration: '',
            language: '',
            releaseDate: '',
            posterUrl: '',
            rating: ''
        });
    };

    const openAddModal = () => {
        setEditingMovie(null);
        resetForm();
        setShowModal(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="admin-page">
            <div className="page-header">
                <div className="header-left">
                    <Link to="/admin" className="back-link">
                        <FaArrowLeft /> Back to Dashboard
                    </Link>
                    <h2><FaFilm /> Manage Movies</h2>
                </div>
                <button className="add-btn" onClick={openAddModal}>
                    <FaPlus /> Add Movie
                </button>
            </div>

            {/* Search and View Toggle */}
            <div className="filter-bar">
                <div className="search-box">
                    <FaSearch />
                    <input 
                        type="text" 
                        placeholder="Search movies by title, genre, or language..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="view-toggle">
                    <button 
                        className={viewMode === 'grid' ? 'active' : ''} 
                        onClick={() => setViewMode('grid')}
                    >
                        Grid
                    </button>
                    <button 
                        className={viewMode === 'table' ? 'active' : ''} 
                        onClick={() => setViewMode('table')}
                    >
                        Table
                    </button>
                </div>
            </div>

            {/* Movies Count */}
            <p className="items-count">Showing {filteredMovies.length} of {movies.length} movies</p>

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="movies-grid">
                    {filteredMovies.length === 0 ? (
                        <div className="no-data-message">No movies found</div>
                    ) : (
                        filteredMovies.map(movie => (
                            <div key={movie._id} className="movie-card-admin">
                                <div className="movie-poster">
                                    <img 
                                        src={movie.posterUrl || '/placeholder-movie.png'} 
                                        alt={movie.title}
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/200x300?text=No+Image'}
                                    />
                                    {movie.rating && (
                                        <div className="movie-rating">
                                            <FaStar /> {movie.rating.toFixed(1)}
                                        </div>
                                    )}
                                </div>
                                <div className="movie-details">
                                    <h3 className="movie-title">{movie.title}</h3>
                                    <div className="movie-meta">
                                        <span className="genre-tags">
                                            {movie.genre.slice(0, 2).map((g, i) => (
                                                <span key={i} className="genre-tag">{g}</span>
                                            ))}
                                        </span>
                                    </div>
                                    <div className="movie-info-row">
                                        <span><FaClock /> {movie.duration} min</span>
                                        <span><FaLanguage /> {movie.language}</span>
                                    </div>
                                    <div className="movie-info-row">
                                        <span><FaCalendarAlt /> {formatDate(movie.releaseDate)}</span>
                                    </div>
                                </div>
                                <div className="movie-actions">
                                    <button onClick={() => handleEdit(movie)} className="edit-btn" title="Edit">
                                        <FaEdit /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(movie._id)} className="delete-btn" title="Delete">
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Poster</th>
                                <th>Title</th>
                                <th>Genre</th>
                                <th>Duration</th>
                                <th>Language</th>
                                <th>Release Date</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMovies.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="no-data">No movies found</td>
                                </tr>
                            ) : (
                                filteredMovies.map(movie => (
                                    <tr key={movie._id}>
                                        <td>
                                            <img 
                                                src={movie.posterUrl || '/placeholder-movie.png'} 
                                                alt={movie.title}
                                                className="table-poster"
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/50x75?text=No+Image'}
                                            />
                                        </td>
                                        <td className="movie-title-cell">{movie.title}</td>
                                        <td>{movie.genre.join(', ')}</td>
                                        <td>{movie.duration} min</td>
                                        <td>{movie.language}</td>
                                        <td>{formatDate(movie.releaseDate)}</td>
                                        <td>
                                            {movie.rating && (
                                                <span className="rating-badge">
                                                    <FaStar /> {movie.rating.toFixed(1)}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button onClick={() => handleEdit(movie)} className="edit-btn" title="Edit">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDelete(movie._id)} className="delete-btn" title="Delete">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal movie-modal">
                        <h3>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input 
                                    name="title" 
                                    value={formData.title} 
                                    onChange={handleChange} 
                                    placeholder="Enter movie title"
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleChange} 
                                    placeholder="Enter movie description"
                                    rows="3"
                                    required 
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Genre (comma separated)</label>
                                    <input 
                                        name="genre" 
                                        value={formData.genre} 
                                        onChange={handleChange} 
                                        placeholder="Action, Drama, Thriller" 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Duration (minutes)</label>
                                    <input 
                                        type="number" 
                                        name="duration" 
                                        value={formData.duration} 
                                        onChange={handleChange} 
                                        placeholder="150"
                                        min="1"
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Language</label>
                                    <select name="language" value={formData.language} onChange={handleChange} required>
                                        <option value="">Select Language</option>
                                        <option value="English">English</option>
                                        <option value="Hindi">Hindi</option>
                                        <option value="Tamil">Tamil</option>
                                        <option value="Telugu">Telugu</option>
                                        <option value="Malayalam">Malayalam</option>
                                        <option value="Kannada">Kannada</option>
                                        <option value="Bengali">Bengali</option>
                                        <option value="Marathi">Marathi</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Release Date</label>
                                    <input 
                                        type="date" 
                                        name="releaseDate" 
                                        value={formData.releaseDate} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Poster URL</label>
                                    <input 
                                        name="posterUrl" 
                                        value={formData.posterUrl} 
                                        onChange={handleChange} 
                                        placeholder="https://example.com/poster.jpg"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Rating (0-10)</label>
                                    <input 
                                        type="number" 
                                        name="rating" 
                                        value={formData.rating} 
                                        onChange={handleChange} 
                                        placeholder="8.5"
                                        min="0" 
                                        max="10" 
                                        step="0.1" 
                                    />
                                </div>
                            </div>
                            
                            {/* Poster Preview */}
                            {formData.posterUrl && (
                                <div className="poster-preview">
                                    <label>Poster Preview</label>
                                    <img 
                                        src={formData.posterUrl} 
                                        alt="Poster preview"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                </div>
                            )}
                            
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn">
                                    {editingMovie ? 'Update Movie' : 'Add Movie'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMovies;
