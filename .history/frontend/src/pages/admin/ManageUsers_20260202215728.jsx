/**
 * ManageUsers.jsx
 * Admin page for user management with role control
 * Features: View all users, change roles, delete users
 */

import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import {
    FaArrowLeft,
    FaUsers,
    FaUserShield,
    FaUser,
    FaTrash,
    FaSearch,
    FaSync,
    FaExclamationTriangle
} from 'react-icons/fa';
import './AdminPages.css';

const ManageUsers = () => {
    // State management
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    
    // Get current user to prevent self-modification
    const { user: currentUser } = useContext(AuthContext);

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    /**
     * Fetch all users from the API
     */
    const fetchUsers = async () => {
        try {
            const res = await API.get('/admin/users');
            setUsers(res.data);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update user role (admin <-> user)
     * @param {string} userId - User ID to update
     * @param {string} newRole - New role to assign
     */
    const handleRoleChange = async (userId, newRole) => {
        // Prevent self-role change
        if (userId === currentUser?._id) {
            toast.error("You cannot change your own role");
            return;
        }
        
        setActionLoading(userId);
        try {
            await API.put(`/admin/users/${userId}/role`, { role: newRole });
            toast.success(`User role updated to ${newRole}`);
            
            // Update local state
            setUsers(prev => prev.map(user => 
                user._id === userId ? { ...user, role: newRole } : user
            ));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update role');
        } finally {
            setActionLoading(null);
        }
    };

    /**
     * Delete a user
     * @param {string} userId - User ID to delete
     */
    const handleDeleteUser = async (userId) => {
        // Prevent self-deletion
        if (userId === currentUser?._id) {
            toast.error("You cannot delete your own account");
            return;
        }
        
        setActionLoading(userId);
        try {
            await API.delete(`/admin/users/${userId}`);
            toast.success('User deleted successfully');
            
            // Remove from local state
            setUsers(prev => prev.filter(user => user._id !== userId));
            setConfirmDelete(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        } finally {
            setActionLoading(null);
        }
    };

    /**
     * Filter users based on search and role
     */
    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        
        return matchesSearch && matchesRole;
    });

    // Calculate stats
    const totalUsers = users.length;
    const adminCount = users.filter(u => u.role === 'admin').length;
    const userCount = users.filter(u => u.role === 'user').length;

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="admin-page manage-users-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="header-left">
                    <Link to="/admin" className="back-link">
                        <FaArrowLeft /> Back to Dashboard
                    </Link>
                    <h2><FaUsers /> Manage Users</h2>
                </div>
                <button className="refresh-btn" onClick={fetchUsers}>
                    <FaSync /> Refresh
                </button>
            </div>

            {/* Stats Row */}
            <div className="stats-row">
                <div className="stat-item">
                    <FaUsers />
                    <span className="stat-value">{totalUsers}</span>
                    <span className="stat-label">Total Users</span>
                </div>
                <div className="stat-item admin">
                    <FaUserShield />
                    <span className="stat-value">{adminCount}</span>
                    <span className="stat-label">Admins</span>
                </div>
                <div className="stat-item user">
                    <FaUser />
                    <span className="stat-value">{userCount}</span>
                    <span className="stat-label">Regular Users</span>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="role-filter"
                >
                    <option value="all">All Roles</option>
                    <option value="admin">Admins Only</option>
                    <option value="user">Users Only</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-data">No users found</td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user._id} className={user._id === currentUser?._id ? 'current-user' : ''}>
                                    <td>
                                        <div className="user-name">
                                            {user.name}
                                            {user._id === currentUser?._id && (
                                                <span className="you-badge">You</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`status ${user.role === 'admin' ? 'confirmed' : 'pending'}`}>
                                            {user.role === 'admin' ? <FaUserShield /> : <FaUser />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            {/* Role Toggle Button */}
                                            {user._id !== currentUser?._id && (
                                                <button
                                                    className={`role-btn ${user.role === 'admin' ? 'demote' : 'promote'}`}
                                                    onClick={() => handleRoleChange(
                                                        user._id, 
                                                        user.role === 'admin' ? 'user' : 'admin'
                                                    )}
                                                    disabled={actionLoading === user._id}
                                                    title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                                >
                                                    {user.role === 'admin' ? (
                                                        <>
                                                            <FaUser /> Demote
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaUserShield /> Make Admin
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                            
                                            {/* Delete Button */}
                                            {user._id !== currentUser?._id && (
                                                confirmDelete === user._id ? (
                                                    <div className="confirm-delete">
                                                        <span>Delete?</span>
                                                        <button 
                                                            className="confirm-yes"
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            disabled={actionLoading === user._id}
                                                        >
                                                            Yes
                                                        </button>
                                                        <button 
                                                            className="confirm-no"
                                                            onClick={() => setConfirmDelete(null)}
                                                        >
                                                            No
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => setConfirmDelete(user._id)}
                                                        disabled={actionLoading === user._id}
                                                        title="Delete User"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Warning Note */}
            <div className="admin-note">
                <FaExclamationTriangle />
                <span>
                    Be careful when promoting users to admin. Admins have full access to manage 
                    movies, theaters, showtimes, bookings, and other users.
                </span>
            </div>
        </div>
    );
};

export default ManageUsers;
