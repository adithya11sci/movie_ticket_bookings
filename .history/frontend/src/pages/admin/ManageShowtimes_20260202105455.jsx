import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './AdminPages.css';

const ManageShowtimes = () => {
    const [showtimes, setShowtimes] = useState([]);
    const [movies, setMovies] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingShowtime, setEditingShowtime] = useState(null);
    
    const [formData, setFormData] = useState({
        movie: '',
        theater: '',
        showDate: '',
        showTime: '',
        regularPrice: '',
        premiumPrice: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [showtimeRes, movieRes, theaterRes] = await Promise.all([
                API.get('/showtimes'),
                API.get('/movies'),
                API.get('/theaters')
            ]);
            setShowtimes(showtimeRes.data);
            setMovies(movieRes.data);
            setTheaters(theaterRes.data);
        } catch (error) {
            toast.error('Failed to load data');
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
            const showtimeData = {
                movie: formData.movie,
                theater: formData.theater,
                showDate: formData.showDate,
                showTime: formData.showTime,
                price: {
                    regular: Number(formData.regularPrice),
                    premium: Number(formData.premiumPrice)
                }
            };

            if (editingShowtime) {
                await API.put(`/showtimes/${editingShowtime._id}`, showtimeData);
                toast.success('Showtime updated!');
            } else {
                await API.post('/showtimes', showtimeData);
                toast.success('Showtime added!');
            }
            
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            toast.error('Failed to save showtime');
        }
    };

    const handleEdit = (showtime) => {
        setEditingShowtime(showtime);
        setFormData({
            movie: showtime.movie?._id || showtime.movie,
            theater: showtime.theater?._id || showtime.theater,
            showDate: showtime.showDate?.split('T')[0],
            showTime: showtime.showTime,
            regularPrice: showtime.price?.regular?.toString() || '',
            premiumPrice: showtime.price?.premium?.toString() || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this showtime?')) return;
        
        try {
            await API.delete(`/showtimes/${id}`);
            toast.success('Showtime deleted');
            fetchData();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const resetForm = () => {
        setFormData({ movie: '', theater: '', showDate: '', showTime: '', regularPrice: '', premiumPrice: '' });
        setEditingShowtime(null);
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="admin-page">
            <div className="page-header">
                <h2>Manage Showtimes</h2>
                <button className="add-btn" onClick={() => { resetForm(); setShowModal(true); }}>
                    <FaPlus /> Add Showtime
                </button>
            </div>

            <div className="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Movie</th>
                            <th>Theater</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Price</th>
                            <th>Available</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showtimes.map(st => (
                            <tr key={st._id}>
                                <td>{st.movie?.title}</td>
                                <td>{st.theater?.name}</td>
                                <td>{new Date(st.showDate).toLocaleDateString()}</td>
                                <td>{st.showTime}</td>
                                <td>₹{st.price?.regular}</td>
                                <td>{st.availableSeats} seats</td>
                                <td>
                                    <button onClick={() => handleEdit(st)} className="edit-btn"><FaEdit /></button>
                                    <button onClick={() => handleDelete(st._id)} className="delete-btn" style={{marginLeft: '0.5rem'}}><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{editingShowtime ? 'Edit Showtime' : 'Add New Showtime'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Movie</label>
                                    <select name="movie" value={formData.movie} onChange={handleChange} required>
                                        <option value="">Select Movie</option>
                                        {movies.map(m => (
                                            <option key={m._id} value={m._id}>{m.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Theater</label>
                                    <select name="theater" value={formData.theater} onChange={handleChange} required>
                                        <option value="">Select Theater</option>
                                        {theaters.map(t => (
                                            <option key={t._id} value={t._id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Show Date</label>
                                    <input type="date" name="showDate" value={formData.showDate} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Show Time</label>
                                    <input name="showTime" value={formData.showTime} onChange={handleChange} placeholder="10:00 AM" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Regular Price (₹)</label>
                                    <input type="number" name="regularPrice" value={formData.regularPrice} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Premium Price (₹)</label>
                                    <input type="number" name="premiumPrice" value={formData.premiumPrice} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                                <button type="submit" className="submit-btn">{editingShowtime ? 'Update' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageShowtimes;
