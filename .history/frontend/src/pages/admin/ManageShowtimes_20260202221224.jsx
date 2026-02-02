/**
 * ManageShowtimes.jsx
 * Admin page for showtime management with refund confirmation on deletion
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
    FaCalendarAlt,
    FaExclamationTriangle,
    FaRupeeSign,
    FaTicketAlt,
    FaUsers
} from 'react-icons/fa';
import './AdminPages.css';

const ManageShowtimes = () => {
    const [showtimes, setShowtimes] = useState([]);
    const [movies, setMovies] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingShowtime, setEditingShowtime] = useState(null);
    
    // Deletion confirmation state
    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deletionImpact, setDeletionImpact] = useState(null);
    const [checkingImpact, setCheckingImpact] = useState(false);
    const [deleting, setDeleting] = useState(false);
    
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

    /**
     * Check deletion impact before deleting
     */
    const handleDeleteClick = async (showtime) => {
        setDeleteTarget(showtime);
        setCheckingImpact(true);
        setDeleteConfirmModal(true);
        
        try {
            const res = await API.get(`/showtimes/${showtime._id}/deletion-impact`);
            setDeletionImpact(res.data.impact);
        } catch (error) {
            // If no impact data, assume safe to delete
            setDeletionImpact({
                totalBookings: 0,
                totalTickets: 0,
                totalRefundAmount: 0,
                affectedUsers: []
            });
        } finally {
            setCheckingImpact(false);
        }
    };

    /**
     * Confirm and execute deletion with refunds
     */
    const confirmDelete = async () => {
        if (!deleteTarget) return;
        
        setDeleting(true);
        try {
            await API.delete(`/showtimes/${deleteTarget._id}?confirm=true`);
            
            if (deletionImpact?.totalBookings > 0) {
                toast.success(`Showtime deleted. ${deletionImpact.totalBookings} bookings refunded (₹${deletionImpact.totalRefundAmount.toLocaleString()})`);
            } else {
                toast.success('Showtime deleted successfully');
            }
            
            setDeleteConfirmModal(false);
            setDeleteTarget(null);
            setDeletionImpact(null);
            fetchData();
        } catch (error) {
            toast.error('Failed to delete showtime');
        } finally {
            setDeleting(false);
        }
    };

    const resetForm = () => {
        setFormData({ movie: '', theater: '', showDate: '', showTime: '', regularPrice: '', premiumPrice: '' });
        setEditingShowtime(null);
    };

    const closeDeleteModal = () => {
        setDeleteConfirmModal(false);
        setDeleteTarget(null);
        setDeletionImpact(null);
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="admin-page">
            <div className="page-header">
                <div className="header-left">
                    <Link to="/admin" className="back-link">
                        <FaArrowLeft /> Back to Dashboard
                    </Link>
                    <h2><FaCalendarAlt /> Manage Showtimes</h2>
                </div>
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
                        {showtimes.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="no-data">No showtimes found</td>
                            </tr>
                        ) : (
                            showtimes.map(st => (
                                <tr key={st._id}>
                                    <td>{st.movie?.title}</td>
                                    <td>{st.theater?.name}</td>
                                    <td>{new Date(st.showDate).toLocaleDateString()}</td>
                                    <td>{st.showTime}</td>
                                    <td>₹{st.price?.regular}</td>
                                    <td>{st.availableSeats} seats</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button onClick={() => handleEdit(st)} className="edit-btn" title="Edit">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDeleteClick(st)} className="delete-btn" title="Delete">
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

            {/* Add/Edit Showtime Modal */}
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

            {/* Delete Confirmation Modal with Refund Info */}
            {deleteConfirmModal && (
                <div className="modal-overlay">
                    <div className="modal delete-confirm-modal">
                        <div className="delete-header">
                            <FaExclamationTriangle className="warning-icon" />
                            <h3>Delete Showtime</h3>
                        </div>
                        
                        <p className="delete-theater-name">
                            Are you sure you want to delete this showtime?
                            <br />
                            <strong>{deleteTarget?.movie?.title}</strong> at <strong>{deleteTarget?.theater?.name}</strong>
                            <br />
                            <span className="delete-date">
                                {deleteTarget?.showDate && new Date(deleteTarget.showDate).toLocaleDateString()} • {deleteTarget?.showTime}
                            </span>
                        </p>
                        
                        {checkingImpact ? (
                            <div className="checking-impact">
                                <div className="loading-spinner small"></div>
                                <span>Checking for active bookings...</span>
                            </div>
                        ) : deletionImpact && deletionImpact.totalBookings > 0 ? (
                            <div className="impact-details">
                                <div className="impact-warning">
                                    <FaExclamationTriangle />
                                    <span>This showtime has active bookings that will be cancelled and refunded!</span>
                                </div>
                                
                                <div className="impact-stats">
                                    <div className="impact-stat">
                                        <FaTicketAlt />
                                        <div>
                                            <span className="stat-value">{deletionImpact.totalBookings}</span>
                                            <span className="stat-label">Bookings</span>
                                        </div>
                                    </div>
                                    <div className="impact-stat">
                                        <FaUsers />
                                        <div>
                                            <span className="stat-value">{deletionImpact.totalTickets}</span>
                                            <span className="stat-label">Tickets</span>
                                        </div>
                                    </div>
                                    <div className="impact-stat refund">
                                        <FaRupeeSign />
                                        <div>
                                            <span className="stat-value">₹{deletionImpact.totalRefundAmount.toLocaleString()}</span>
                                            <span className="stat-label">To Refund</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {deletionImpact.affectedUsers?.length > 0 && (
                                    <div className="affected-users">
                                        <h4>Affected Users:</h4>
                                        <div className="users-list">
                                            {deletionImpact.affectedUsers.slice(0, 5).map((user, index) => (
                                                <div key={index} className="affected-user">
                                                    <span className="user-name">{user.name}</span>
                                                    <span className="user-details">{user.tickets} tickets • ₹{user.amount}</span>
                                                </div>
                                            ))}
                                            {deletionImpact.affectedUsers.length > 5 && (
                                                <div className="more-users">
                                                    +{deletionImpact.affectedUsers.length - 5} more users
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="safe-delete">No active bookings found. Safe to delete.</p>
                        )}
                        
                        <div className="modal-actions">
                            <button 
                                type="button" 
                                onClick={closeDeleteModal} 
                                className="cancel-btn"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button 
                                type="button" 
                                onClick={confirmDelete} 
                                className="confirm-delete-btn"
                                disabled={checkingImpact || deleting}
                            >
                                {deleting ? 'Deleting...' : 
                                 deletionImpact?.totalBookings > 0 ? 'Delete & Refund All' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageShowtimes;
