/**
 * ManageBookings.jsx
 * Admin page for booking management
 * Features: View all bookings, filter by status/date, cancel bookings, export data
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import {
    FaArrowLeft,
    FaTicketAlt,
    FaSearch,
    FaSync,
    FaFilter,
    FaBan,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaRupeeSign,
    FaCalendarAlt,
    FaExclamationTriangle
} from 'react-icons/fa';
import './AdminPages.css';

const ManageBookings = () => {
    // State management
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPayment, setFilterPayment] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [confirmCancel, setConfirmCancel] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [summary, setSummary] = useState(null);

    // Fetch bookings on component mount
    useEffect(() => {
        fetchBookings();
    }, []);

    /**
     * Fetch all bookings from the API
     */
    const fetchBookings = async () => {
        try {
            const res = await API.get('/admin/bookings');
            setBookings(res.data.bookings || res.data);
            setSummary(res.data.summary || null);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Cancel a booking as admin
     * @param {string} bookingId - Booking ID to cancel
     */
    const handleCancelBooking = async (bookingId) => {
        setActionLoading(bookingId);
        try {
            await API.put(`/admin/bookings/${bookingId}/cancel`);
            toast.success('Booking cancelled successfully');
            
            // Update local state
            setBookings(prev => prev.map(booking => 
                booking._id === bookingId 
                    ? { ...booking, bookingStatus: 'cancelled' } 
                    : booking
            ));
            setConfirmCancel(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel booking');
        } finally {
            setActionLoading(null);
        }
    };

    /**
     * Format date for display
     */
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    /**
     * Filter bookings based on search and filters
     */
    const filteredBookings = bookings.filter(booking => {
        // Search filter
        const matchesSearch = 
            booking._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.showTime?.movie?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Status filter
        const matchesStatus = filterStatus === 'all' || booking.bookingStatus === filterStatus;
        
        // Payment filter
        const matchesPayment = filterPayment === 'all' || booking.paymentStatus === filterPayment;
        
        // Date filter
        let matchesDate = true;
        if (dateFrom) {
            const bookingDate = new Date(booking.bookingDate);
            const fromDate = new Date(dateFrom);
            matchesDate = bookingDate >= fromDate;
        }
        if (dateTo && matchesDate) {
            const bookingDate = new Date(booking.bookingDate);
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59);
            matchesDate = bookingDate <= toDate;
        }
        
        return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });

    // Calculate stats from filtered bookings
    const totalAmount = filteredBookings.reduce((sum, b) => 
        b.bookingStatus !== 'cancelled' ? sum + (b.totalAmount || 0) : sum, 0
    );
    const confirmedCount = filteredBookings.filter(b => b.bookingStatus === 'confirmed').length;
    const pendingCount = filteredBookings.filter(b => b.bookingStatus === 'pending').length;
    const cancelledCount = filteredBookings.filter(b => b.bookingStatus === 'cancelled').length;

    /**
     * Get status icon based on booking status
     */
    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return <FaCheckCircle />;
            case 'pending': return <FaClock />;
            case 'cancelled': return <FaTimesCircle />;
            default: return null;
        }
    };

    /**
     * Clear all filters
     */
    const clearFilters = () => {
        setSearchTerm('');
        setFilterStatus('all');
        setFilterPayment('all');
        setDateFrom('');
        setDateTo('');
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="admin-page manage-bookings-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="header-left">
                    <Link to="/admin" className="back-link">
                        <FaArrowLeft /> Back to Dashboard
                    </Link>
                    <h2><FaTicketAlt /> Manage Bookings</h2>
                </div>
                <button className="refresh-btn" onClick={fetchBookings}>
                    <FaSync /> Refresh
                </button>
            </div>

            {/* Stats Row */}
            <div className="stats-row">
                <div className="stat-item revenue">
                    <FaRupeeSign />
                    <span className="stat-value">₹{totalAmount.toLocaleString()}</span>
                    <span className="stat-label">Total Revenue</span>
                </div>
                <div className="stat-item confirmed">
                    <FaCheckCircle />
                    <span className="stat-value">{confirmedCount}</span>
                    <span className="stat-label">Confirmed</span>
                </div>
                <div className="stat-item pending">
                    <FaClock />
                    <span className="stat-value">{pendingCount}</span>
                    <span className="stat-label">Pending</span>
                </div>
                <div className="stat-item cancelled">
                    <FaTimesCircle />
                    <span className="stat-value">{cancelledCount}</span>
                    <span className="stat-label">Cancelled</span>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar multi-row">
                <div className="filter-row">
                    <div className="search-box">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search by ID, user, or movie..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="status-filter"
                    >
                        <option value="all">All Status</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    
                    <select
                        value={filterPayment}
                        onChange={(e) => setFilterPayment(e.target.value)}
                        className="payment-filter"
                    >
                        <option value="all">All Payments</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
                
                <div className="filter-row">
                    <div className="date-range">
                        <FaCalendarAlt />
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            placeholder="From"
                        />
                        <span>to</span>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            placeholder="To"
                        />
                    </div>
                    
                    <button className="clear-filters" onClick={clearFilters}>
                        <FaFilter /> Clear Filters
                    </button>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>User</th>
                            <th>Movie</th>
                            <th>Theater</th>
                            <th>Seats</th>
                            <th>Amount</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="no-data">No bookings found</td>
                            </tr>
                        ) : (
                            filteredBookings.map(booking => (
                                <tr key={booking._id} className={booking.bookingStatus === 'cancelled' ? 'cancelled-row' : ''}>
                                    <td className="booking-id">#{booking._id.slice(-8)}</td>
                                    <td>
                                        <div className="user-info">
                                            <span className="user-name">{booking.user?.name}</span>
                                            <span className="user-email">{booking.user?.email}</span>
                                        </div>
                                    </td>
                                    <td>{booking.showTime?.movie?.title || 'N/A'}</td>
                                    <td>{booking.showTime?.theater?.name || 'N/A'}</td>
                                    <td className="seats-cell">
                                        {booking.seats?.map(s => s.seatNumber).join(', ') || 'N/A'}
                                    </td>
                                    <td className="amount-cell">₹{booking.totalAmount}</td>
                                    <td>
                                        <span className={`status payment-${booking.paymentStatus}`}>
                                            {booking.paymentStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status booking-${booking.bookingStatus}`}>
                                            {getStatusIcon(booking.bookingStatus)}
                                            {booking.bookingStatus}
                                        </span>
                                    </td>
                                    <td>{formatDate(booking.bookingDate)}</td>
                                    <td>
                                        {booking.bookingStatus !== 'cancelled' && (
                                            confirmCancel === booking._id ? (
                                                <div className="confirm-delete">
                                                    <span>Cancel?</span>
                                                    <button 
                                                        className="confirm-yes"
                                                        onClick={() => handleCancelBooking(booking._id)}
                                                        disabled={actionLoading === booking._id}
                                                    >
                                                        Yes
                                                    </button>
                                                    <button 
                                                        className="confirm-no"
                                                        onClick={() => setConfirmCancel(null)}
                                                    >
                                                        No
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="cancel-btn"
                                                    onClick={() => setConfirmCancel(booking._id)}
                                                    disabled={actionLoading === booking._id}
                                                    title="Cancel Booking"
                                                >
                                                    <FaBan /> Cancel
                                                </button>
                                            )
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Info Note */}
            <div className="admin-note warning">
                <FaExclamationTriangle />
                <span>
                    Cancelling a booking will release the seats and update the seat availability. 
                    This action cannot be undone.
                </span>
            </div>
        </div>
    );
};

export default ManageBookings;
