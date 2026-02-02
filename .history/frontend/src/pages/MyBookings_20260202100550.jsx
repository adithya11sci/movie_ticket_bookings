import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { FaTicketAlt, FaTimes } from 'react-icons/fa';
import './MyBookings.css';

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            await API.put(`/bookings/${bookingId}/cancel`);
            toast.success('Booking cancelled');
            fetchBookings();
        } catch (error) {
            toast.error('Failed to cancel booking');
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'confirmed': return 'status confirmed';
            case 'cancelled': return 'status cancelled';
            case 'pending': return 'status pending';
            default: return 'status';
        }
    };

    if (loading) {
        return <div className="loading-page">Loading...</div>;
    }

    return (
        <div className="my-bookings">
            <h1><FaTicketAlt /> My Bookings</h1>

            {bookings.length > 0 ? (
                <div className="bookings-list">
                    {bookings.map(booking => (
                        <div key={booking._id} className="booking-card">
                            <div className="booking-poster">
                                <img 
                                    src={booking.showTime?.movie?.posterUrl} 
                                    alt={booking.showTime?.movie?.title} 
                                />
                            </div>
                            
                            <div className="booking-details">
                                <h3>{booking.showTime?.movie?.title}</h3>
                                <p className="theater">{booking.showTime?.theater?.name}</p>
                                <p className="datetime">
                                    {new Date(booking.showTime?.showDate).toLocaleDateString()} | {booking.showTime?.showTime}
                                </p>
                                <p className="seats">
                                    Seats: {booking.seats?.map(s => s.seatNumber).join(', ')}
                                </p>
                                <p className="amount">Total: ₹{booking.totalAmount}</p>
                            </div>

                            <div className="booking-status">
                                <span className={getStatusClass(booking.bookingStatus)}>
                                    {booking.bookingStatus}
                                </span>
                                <span className={`payment ${booking.paymentStatus}`}>
                                    Payment: {booking.paymentStatus}
                                </span>
                                
                                {booking.bookingStatus !== 'cancelled' && (
                                    <button 
                                        className="cancel-btn"
                                        onClick={() => handleCancel(booking._id)}
                                    >
                                        <FaTimes /> Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-bookings">
                    <p>You haven't made any bookings yet.</p>
                    <button onClick={() => navigate('/')}>Browse Movies</button>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
