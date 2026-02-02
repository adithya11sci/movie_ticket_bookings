import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './AdminPages.css';

const ManageMovies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    
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

    const fetchMovies = async () => {
        try {
            const res = await API.get('/movies');
            setMovies(res.data);
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
            releaseDate: movie.releaseDate.split('T')[0],
            posterUrl: movie.posterUrl,
            rating: movie.rating.toString()
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

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="admin-page">
            <div className="page-header">
                <h2>Manage Movies</h2>
                <button className="add-btn" onClick={openAddModal}>
                    <FaPlus /> Add Movie
                </button>
            </div>

            <div className="items-grid">
                {movies.map(movie => (
                    <div key={movie._id} className="item-card">
                        <img src={movie.posterUrl} alt={movie.title} />
                        <div className="item-info">
                            <h3>{movie.title}</h3>
                            <p>{movie.genre.join(', ')}</p>
                            <p>{movie.duration} min | {movie.language}</p>
                        </div>
                        <div className="item-actions">
                            <button onClick={() => handleEdit(movie)} className="edit-btn">
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(movie._id)} className="delete-btn">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input name="title" value={formData.title} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Genre (comma separated)</label>
                                    <input name="genre" value={formData.genre} onChange={handleChange} placeholder="Action, Drama" required />
                                </div>
                                <div className="form-group">
                                    <label>Duration (min)</label>
                                    <input type="number" name="duration" value={formData.duration} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Language</label>
                                    <input name="language" value={formData.language} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Release Date</label>
                                    <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Poster URL</label>
                                    <input name="posterUrl" value={formData.posterUrl} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Rating (0-10)</label>
                                    <input type="number" name="rating" value={formData.rating} onChange={handleChange} min="0" max="10" step="0.1" />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                                <button type="submit" className="submit-btn">
                                    {editingMovie ? 'Update' : 'Add'} Movie
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
