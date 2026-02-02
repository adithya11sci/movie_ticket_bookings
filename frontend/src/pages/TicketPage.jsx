import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { 
    FaArrowLeft, 
    FaCalendarAlt, 
    FaClock, 
    FaMapMarkerAlt, 
    FaChair, 
    FaFilm,
    FaQrcode,
    FaDownload,
    FaShare,
    FaTicketAlt,
    FaUser,
    FaRupeeSign,
    FaCheckCircle,
    FaTimesCircle,
    FaCopy
} from 'react-icons/fa';
import './TicketPage.css';

const TicketPage = () => {
    const { bookingId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const ticketRef = useRef(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBooking();
    }, [user, bookingId]);

    const fetchBooking = async () => {
        try {
            const res = await API.get(`/bookings/${bookingId}`);
            setBooking(res.data);
        } catch (error) {
            toast.error('Failed to load ticket details');
            navigate('/my-bookings');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    };

    const formatBookingDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const copyBookingId = () => {
        navigator.clipboard.writeText(booking._id);
        toast.success('Booking ID copied!');
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Movie Ticket - ${booking.showTime?.movie?.title}`,
                    text: `Check out my ticket for ${booking.showTime?.movie?.title} at ${booking.showTime?.theater?.name}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Share cancelled');
            }
        } else {
            copyBookingId();
        }
    };

    if (loading) {
        return (
            <div className="ticket-page">
                <div className="ticket-loader">
                    <FaTicketAlt className="loader-icon" />
                    <p>Loading your ticket...</p>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="ticket-page">
                <div className="ticket-not-found">
                    <FaTimesCircle />
                    <h2>Ticket Not Found</h2>
                    <p>We couldn't find the ticket you're looking for.</p>
                    <button onClick={() => navigate('/my-bookings')}>
                        Go to My Bookings
                    </button>
                </div>
            </div>
        );
    }

    const isConfirmed = booking.bookingStatus === 'confirmed';
    const isCancelled = booking.bookingStatus === 'cancelled';

    return (
        <div className="ticket-page">
            <div className="ticket-page-header">
                <button className="back-btn" onClick={() => navigate('/my-bookings')}>
                    <FaArrowLeft /> Back to Bookings
                </button>
                <div className="header-actions">
                    <button className="action-btn" onClick={handleShare}>
                        <FaShare /> Share
                    </button>
                </div>
            </div>

            <div className="ticket-container" ref={ticketRef}>
                {/* Ticket Status Banner */}
                <div className={`ticket-status-banner ${booking.bookingStatus}`}>
                    {isConfirmed ? (
                        <>
                            <FaCheckCircle />
                            <span>Booking Confirmed</span>
                        </>
                    ) : isCancelled ? (
                        <>
                            <FaTimesCircle />
                            <span>Booking Cancelled</span>
                        </>
                    ) : (
                        <>
                            <FaClock />
                            <span>Booking Pending</span>
                        </>
                    )}
                </div>

                <div className="ticket-main">
                    {/* Movie Poster & Info */}
                    <div className="ticket-movie-section">
                        <div className="movie-poster-large">
                            <img 
                                src={booking.showTime?.movie?.posterUrl} 
                                alt={booking.showTime?.movie?.title} 
                            />
                        </div>
                        <div className="movie-info-large">
                            <h1>{booking.showTime?.movie?.title}</h1>
                            <div className="movie-meta">
                                <span className="genre">{booking.showTime?.movie?.genre}</span>
                                <span className="duration">{booking.showTime?.movie?.duration} mins</span>
                                <span className="language">{booking.showTime?.movie?.language}</span>
                            </div>
                        </div>
                    </div>

                    {/* Ticket Divider */}
                    <div className="ticket-tear-line">
                        <div className="tear-circle left"></div>
                        <div className="tear-dashes"></div>
                        <div className="tear-circle right"></div>
                    </div>

                    {/* Ticket Details */}
                    <div className="ticket-details-section">
                        <div className="details-grid">
                            <div className="detail-item">
                                <div className="detail-icon">
                                    <FaMapMarkerAlt />
                                </div>
                                <div className="detail-content">
                                    <span className="detail-label">Theater</span>
                                    <span className="detail-value">{booking.showTime?.theater?.name}</span>
                                    <span className="detail-sub">{booking.showTime?.theater?.location}</span>
                                </div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-icon">
                                    <FaCalendarAlt />
                                </div>
                                <div className="detail-content">
                                    <span className="detail-label">Date</span>
                                    <span className="detail-value">{formatDate(booking.showTime?.showDate)}</span>
                                </div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-icon">
                                    <FaClock />
                                </div>
                                <div className="detail-content">
                                    <span className="detail-label">Show Time</span>
                                    <span className="detail-value">{booking.showTime?.showTime}</span>
                                </div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-icon">
                                    <FaFilm />
                                </div>
                                <div className="detail-content">
                                    <span className="detail-label">Screen</span>
                                    <span className="detail-value">{booking.showTime?.screenNumber || 'Screen 1'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Seats Section */}
                        <div className="seats-section">
                            <h3><FaChair /> Your Seats</h3>
                            <div className="seats-display">
                                {booking.seats?.map((seat, index) => (
                                    <div key={index} className="seat-badge">
                                        {seat.seatNumber}
                                    </div>
                                ))}
                            </div>
                            <p className="seats-count">{booking.seats?.length} Ticket(s)</p>
                        </div>

                        {/* Price Section */}
                        <div className="price-section">
                            <div className="price-row">
                                <span>Ticket Price ({booking.seats?.length}x)</span>
                                <span>₹{booking.showTime?.price * booking.seats?.length}</span>
                            </div>
                            <div className="price-row">
                                <span>Convenience Fee</span>
                                <span>₹{Math.round(booking.totalAmount - (booking.showTime?.price * booking.seats?.length))}</span>
                            </div>
                            <div className="price-row total">
                                <span>Total Amount</span>
                                <span><FaRupeeSign />{booking.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="qr-section">
                        <div className="qr-code">
                            <FaQrcode className="qr-icon" />
                            <div className="qr-pattern">
                                {[...Array(64)].map((_, i) => (
                                    <div key={i} className={`qr-cell ${Math.random() > 0.5 ? 'filled' : ''}`}></div>
                                ))}
                            </div>
                        </div>
                        <div className="booking-reference">
                            <span className="ref-label">Booking ID</span>
                            <div className="ref-id" onClick={copyBookingId}>
                                <span>{booking._id?.toUpperCase()}</span>
                                <FaCopy />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ticket Footer */}
                <div className="ticket-footer-section">
                    <div className="footer-info">
                        <div className="info-item">
                            <FaUser />
                            <span>{booking.user?.name || user?.name}</span>
                        </div>
                        <div className="info-item">
                            <span>Booked on: {formatBookingDate(booking.createdAt)}</span>
                        </div>
                    </div>
                    <div className="ticket-barcode-large">
                        <div className="barcode-lines-large">
                            {[...Array(50)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className="barcode-line-large"
                                    style={{ 
                                        height: `${Math.random() * 30 + 20}px`,
                                        width: `${Math.random() > 0.7 ? 3 : 2}px`
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="ticket-instructions">
                <h3>Important Information</h3>
                <ul>
                    <li>Please arrive at least 15 minutes before the show time</li>
                    <li>Carry a valid ID proof along with this ticket</li>
                    <li>Outside food and beverages are not allowed</li>
                    <li>This ticket is non-transferable</li>
                </ul>
            </div>
        </div>
    );
};

export default TicketPage;
