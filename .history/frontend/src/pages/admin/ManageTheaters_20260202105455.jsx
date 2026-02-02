import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './AdminPages.css';

const ManageTheaters = () => {
    const [theaters, setTheaters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTheater, setEditingTheater] = useState(null);
    
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

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this theater?')) return;
        
        try {
            await API.delete(`/theaters/${id}`);
            toast.success('Theater deleted');
            fetchTheaters();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', location: '', city: '', totalSeats: '', rows: '10', columns: '12' });
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="admin-page">
            <div className="page-header">
                <h2>Manage Theaters</h2>
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
                        {theaters.map(theater => (
                            <tr key={theater._id}>
                                <td>{theater.name}</td>
                                <td>{theater.location}</td>
                                <td>{theater.city}</td>
                                <td>{theater.totalSeats}</td>
                                <td>{theater.seatLayout?.rows} x {theater.seatLayout?.columns}</td>
                                <td>
                                    <button onClick={() => handleEdit(theater)} className="edit-btn"><FaEdit /></button>
                                    <button onClick={() => handleDelete(theater._id)} className="delete-btn" style={{marginLeft: '0.5rem'}}><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
        </div>
    );
};

export default ManageTheaters;
