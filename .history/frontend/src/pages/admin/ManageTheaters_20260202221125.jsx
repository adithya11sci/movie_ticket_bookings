/**
 * ManageTheaters.jsx
 * Admin page for theater management with refund confirmation on deletion
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
    FaTheaterMasks,
    FaExclamationTriangle,
    FaRupeeSign,
    FaTicketAlt,
    FaUsers
} from 'react-icons/fa';
import './AdminPages.css';

const ManageTheaters = () => {
    const [theaters, setTheaters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTheater, setEditingTheater] = useState(null);
    
    // Deletion confirmation state
    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deletionImpact, setDeletionImpact] = useState(null);
    const [checkingImpact, setCheckingImpact] = useState(false);
    const [deleting, setDeleting] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        city: '',
        totalSeats: '',
        rows: '10',
        columns: '12'
    });

    useEffect(() => {
        fetchTheaters();
    }, []);

    const fetchTheaters = async () => {
        try {
            const res = await API.get('/theaters');
            setTheaters(res.data);
        } catch (error) {
            toast.error('Failed to load theaters');
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
            const theaterData = {
                name: formData.name,
                location: formData.location,
                city: formData.city,
                totalSeats: Number(formData.totalSeats),
                seatLayout: {
                    rows: Number(formData.rows),
                    columns: Number(formData.columns)
                }
            };

            if (editingTheater) {
                await API.put(`/theaters/${editingTheater._id}`, theaterData);
                toast.success('Theater updated!');
            } else {
                await API.post('/theaters', theaterData);
                toast.success('Theater added!');
            }
            
            setShowModal(false);
            setEditingTheater(null);
            resetForm();
            fetchTheaters();
        } catch (error) {
            toast.error('Failed to save theater');
        }
    };

    const handleEdit = (theater) => {
        setEditingTheater(theater);
        setFormData({
            name: theater.name,
            location: theater.location,
            city: theater.city,
            totalSeats: theater.totalSeats.toString(),
            rows: theater.seatLayout?.rows?.toString() || '10',
            columns: theater.seatLayout?.columns?.toString() || '12'
        });
        setShowModal(true);
    };

    /**
     * Check deletion impact before deleting
     */
    const handleDeleteClick = async (theater) => {
        setDeleteTarget(theater);
        setCheckingImpact(true);
        setDeleteConfirmModal(true);
        
        try {
            const res = await API.get(`/theaters/${theater._id}/deletion-impact`);
            setDeletionImpact(res.data.impact);
        } catch (error) {
            // If no impact data, assume safe to delete
            setDeletionImpact({
                totalShowtimes: 0,
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
            await API.delete(`/theaters/${deleteTarget._id}?confirm=true`);
            
            if (deletionImpact?.totalBookings > 0) {
                toast.success(`Theater deleted. ${deletionImpact.totalBookings} bookings refunded (₹${deletionImpact.totalRefundAmount.toLocaleString()})`);
            } else {
                toast.success('Theater deleted successfully');
            }
            
            setDeleteConfirmModal(false);
            setDeleteTarget(null);
            setDeletionImpact(null);
            fetchTheaters();
        } catch (error) {
            toast.error('Failed to delete theater');
        } finally {
            setDeleting(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', location: '', city: '', totalSeats: '', rows: '10', columns: '12' });
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
                    <h2><FaTheaterMasks /> Manage Theaters</h2>
                </div>
                <button className="add-btn" onClick={() => { resetForm(); setEditingTheater(null); setShowModal(true); }}>
                    <FaPlus /> Add Theater
                </button>
            </div>

            <div className="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Location</th>
                            <th>City</th>
                            <th>Total Seats</th>
                            <th>Layout</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {theaters.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="no-data">No theaters found</td>
                            </tr>
                        ) : (
                            theaters.map(theater => (
                                <tr key={theater._id}>
                                    <td>{theater.name}</td>
                                    <td>{theater.location}</td>
                                    <td>{theater.city}</td>
                                    <td>{theater.totalSeats}</td>
                                    <td>{theater.seatLayout?.rows} x {theater.seatLayout?.columns}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button onClick={() => handleEdit(theater)} className="edit-btn" title="Edit">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDeleteClick(theater)} className="delete-btn" title="Delete">
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

            {/* Add/Edit Theater Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{editingTheater ? 'Edit Theater' : 'Add New Theater'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Theater Name</label>
                                <input name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Location</label>
                                    <input name="location" value={formData.location} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <input name="city" value={formData.city} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Total Seats</label>
                                    <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Rows</label>
                                    <input type="number" name="rows" value={formData.rows} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Columns</label>
                                    <input type="number" name="columns" value={formData.columns} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                                <button type="submit" className="submit-btn">{editingTheater ? 'Update' : 'Add'}</button>
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
                            <h3>Delete Theater</h3>
                        </div>
                        
                        <p className="delete-theater-name">
                            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
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
                                    <span>This theater has active bookings that will be cancelled and refunded!</span>
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

export default ManageTheaters;
