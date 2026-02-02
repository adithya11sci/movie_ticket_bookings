import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { 
    FaTicketAlt, 
    FaTimes, 
    FaCalendarAlt, 
    FaClock, 
    FaMapMarkerAlt, 
    FaChair, 
    FaFilm,
    FaQrcode,
    FaEye,
    FaRupeeSign
} from 'react-icons/fa';
import './MyBookings.css';

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user]);

    const fetchBookings = async () => {
        try {
            const res = await API.get('/bookings/my-bookings');
            setBookings(res.data);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (e, bookingId) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to cancel this booking?\n\n⚠️ Note: No refund will be provided for cancelled bookings.')) {
            return;
        }

        try {
            await API.put(`/bookings/${bookingId}/cancel`);
            toast.success('Booking cancelled. Note: No refund will be processed.');
            fetchBookings();
        } catch (error) {
            toast.error('Failed to cancel booking');
        }
    };

    const handleViewTicket = (booking) => {
        navigate(`/booking/${booking._id}/ticket`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    const isUpcoming = (showDate) => {
        return new Date(showDate) > new Date();
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        if (filter === 'upcoming') return isUpcoming(booking.showTime?.showDate) && booking.bookingStatus !== 'cancelled';
        if (filter === 'past') return !isUpcoming(booking.showTime?.showDate) && booking.bookingStatus !== 'cancelled';
        if (filter === 'cancelled') return booking.bookingStatus === 'cancelled';
        return true;
    });

    const getBookingStats = () => {
        const upcoming = bookings.filter(b => isUpcoming(b.showTime?.showDate) && b.bookingStatus !== 'cancelled').length;
        const past = bookings.filter(b => !isUpcoming(b.showTime?.showDate) && b.bookingStatus !== 'cancelled').length;
        const cancelled = bookings.filter(b => b.bookingStatus === 'cancelled').length;
        return { total: bookings.length, upcoming, past, cancelled };
    };

    const stats = getBookingStats();

    if (loading) {
        return (
            <div className="my-bookings-page">
                <div className="bookings-loader">
                    <div className="loader-ticket">
                        <FaTicketAlt />
                    </div>
                    <p>Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-bookings-page">
            <div className="bookings-header">
                <div className="header-content">
                    <h1>
                        <FaTicketAlt className="header-icon" />
                        My Bookings
                    </h1>
                    <p className="header-subtitle">Manage and view all your movie tickets</p>
                </div>
                
                <div className="bookings-stats">
                    <div className="stat-item">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total</span>
                    </div>
                    <div className="stat-item upcoming">
                        <span className="stat-value">{stats.upcoming}</span>
                        <span className="stat-label">Upcoming</span>
                    </div>
                    <div className="stat-item past">
                        <span className="stat-value">{stats.past}</span>
                        <span className="stat-label">Watched</span>
                    </div>
                    <div className="stat-item cancelled">
                        <span className="stat-value">{stats.cancelled}</span>
                        <span className="stat-label">Cancelled</span>
                    </div>
                </div>
            </div>

            <div className="bookings-filter">
                <button 
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Bookings
                </button>
                <button 
                    className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setFilter('upcoming')}
                >
                    Upcoming
                </button>
                <button 
                    className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
                    onClick={() => setFilter('past')}
                >
                    Past
                </button>
                <button 
                    className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
                    onClick={() => setFilter('cancelled')}
                >
                    Cancelled
                </button>
            </div>

            {filteredBookings.length > 0 ? (
                <div className="bookings-grid">
                    {filteredBookings.map((booking, index) => (
                        <div 
                            key={booking._id} 
                            className={`ticket-card ${booking.bookingStatus === 'cancelled' ? 'cancelled' : ''} ${!isUpcoming(booking.showTime?.showDate) ? 'past' : ''}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                            onClick={() => handleViewTicket(booking)}
                        >
                            <div className="ticket-left">
                                <div className="ticket-poster">
                                    <img 
                                        src={booking.showTime?.movie?.posterUrl} 
                                        alt={booking.showTime?.movie?.title} 
                                    />
                                    <div className="poster-overlay">
                                        <FaEye />
                                        <span>View Ticket</span>
                                    </div>
                                </div>
                            </div>

                            <div className="ticket-divider">
                                <div className="divider-circle top"></div>
                                <div className="divider-line"></div>
                                <div className="divider-circle bottom"></div>
                            </div>

                            <div className="ticket-right">
                                <div className="ticket-header">
                                    <h3 className="movie-title">{booking.showTime?.movie?.title}</h3>
                                    <span className={`status-badge ${booking.bookingStatus}`}>
                                        {booking.bookingStatus}
                                    </span>
                                </div>

                                <div className="ticket-info">
                                    <div className="info-row">
                                        <FaMapMarkerAlt />
                                        <span>{booking.showTime?.theater?.name}</span>
                                    </div>
                                    <div className="info-row">
                                        <FaCalendarAlt />
                                        <span>{formatDate(booking.showTime?.showDate)}</span>
                                    </div>
                                    <div className="info-row">
                                        <FaClock />
                                        <span>{booking.showTime?.showTime}</span>
                                    </div>
                                    <div className="info-row seats">
                                        <FaChair />
                                        <span>{booking.seats?.map(s => s.seatNumber).join(', ')}</span>
                                    </div>
                                </div>

                                <div className="ticket-footer">
                                    <div className="ticket-price">
                                        <FaRupeeSign />
                                        <span className="price-value">{booking.totalAmount}</span>
                                    </div>
                                    
                                    <div className="ticket-actions">
                                        {booking.bookingStatus !== 'cancelled' && isUpcoming(booking.showTime?.showDate) && (
                                            <button 
                                                className="cancel-btn"
                                                onClick={(e) => handleCancel(e, booking._id)}
                                            >
                                                <FaTimes /> Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="ticket-barcode">
                                    <div className="barcode-lines">
                                        {[...Array(30)].map((_, i) => (
                                            <div 
                                                key={i} 
                                                className="barcode-line"
                                                style={{ height: `${Math.random() * 20 + 10}px` }}
                                            ></div>
                                        ))}
                                    </div>
                                    <span className="booking-id">#{booking._id?.slice(-8).toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-bookings">
                    <div className="empty-icon">
                        <FaFilm />
                    </div>
                    <h3>No Bookings Found</h3>
                    <p>
                        {filter === 'all' 
                            ? "You haven't made any bookings yet. Start exploring movies!" 
                            : `No ${filter} bookings found.`}
                    </p>
                    <button onClick={() => navigate('/movies')} className="browse-btn">
                        <FaTicketAlt /> Browse Movies
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
