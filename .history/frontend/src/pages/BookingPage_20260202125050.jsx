import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import SeatSelector from '../components/SeatSelector';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import './BookingPage.css';

const BookingPage = () => {
    const { showtimeId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const [showtime, setShowtime] = useState(null);
    const [allShowtimes, setAllShowtimes] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [userBookedSeats, setUserBookedSeats] = useState([]);
    const [lockedSeats, setLockedSeats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            toast.error('Please login to book tickets');
            navigate('/login');
            return;
        }
        fetchShowtime();
        fetchUserSeats();
        fetchSeatStatus();
    }, [showtimeId, user]);

    const fetchShowtime = async () => {
        try {
            const res = await API.get(`/showtimes/${showtimeId}`);
            setShowtime(res.data);
            
            // Fetch all showtimes for this movie on same date and theater
            if (res.data.movie?._id) {
                const allRes = await API.get(`/showtimes/movie/${res.data.movie._id}`);
                // Filter to same theater and date
                const filtered = allRes.data.filter(st => 
                    st.theater?._id === res.data.theater?._id &&
                    new Date(st.showDate).toDateString() === new Date(res.data.showDate).toDateString()
                );
                setAllShowtimes(filtered);
            }
        } catch (error) {
            console.log('Error:', error);
            toast.error('Failed to load showtime');
        } finally {
            setLoading(false);
        }
    };

    // Fetch user's booked seats for this showtime
    const fetchUserSeats = async () => {
        try {
            const res = await API.get(`/bookings/showtime/${showtimeId}/my-seats`);
            setUserBookedSeats(res.data.mySeats || []);
        } catch (error) {
            console.log('Error fetching user seats:', error);
        }
    };

    // Fetch seat status (locked seats by others)
    const fetchSeatStatus = async () => {
        try {
            const res = await API.get(`/bookings/showtime/${showtimeId}/seat-status`);
            // Get locked seats (that are not booked and locked by others)
            const locked = (res.data.seatStatus || [])
                .filter(s => s.status === 'locked')
                .map(s => s.seatNumber);
            setLockedSeats(locked);
        } catch (error) {
            console.log('Error fetching seat status:', error);
        }
    };

    const calculateTotal = () => {
        if (!showtime) return 0;
        return selectedSeats.reduce((total, seat) => {
            // Different pricing based on seat section
            const row = seat[0];
            if (row === 'N' || row === 'M') {
                return total + (showtime.price?.vip || 480);
            } else if (['L', 'K', 'J', 'I', 'H', 'G'].includes(row)) {
                return total + (showtime.price?.premium || 280);
            } else {
                return total + (showtime.price?.regular || 180);
            }
        }, 0);
    };

    const handleBooking = async () => {
        if (selectedSeats.length === 0) {
            toast.error('Please select at least one seat');
            return;
        }

        try {
            const bookingData = {
                showTimeId: showtimeId,
                seats: selectedSeats.map(seat => {
                    const row = seat[0];
                    let seatType = 'regular';
                    if (row === 'N' || row === 'M') {
                        seatType = 'vip';
                    } else if (['L', 'K', 'J', 'I', 'H', 'G'].includes(row)) {
                        seatType = 'premium';
                    }
                    return { seatNumber: seat, seatType };
                }),
                totalAmount: calculateTotal()
            };

            const res = await API.post('/bookings', bookingData);
            toast.success('Booking created! Proceed to payment');
            navigate(`/payment/${res.data.booking._id}`);
        } catch (error) {
            // Handle 409 conflict (seat already booked/locked)
            if (error.response?.status === 409) {
                toast.error(error.response.data.message || 'Seat is no longer available');
                // Refresh seat data
                fetchShowtime();
                fetchUserSeats();
                fetchSeatStatus();
                // Remove conflicting seat from selection
                if (error.response.data.conflictSeat) {
                    setSelectedSeats(prev => prev.filter(s => s !== error.response.data.conflictSeat));
                }
            } else {
                toast.error(error.response?.data?.message || 'Booking failed');
            }
        }
    };

    const handleShowtimeChange = (newShowtimeId) => {
        navigate(`/booking/${newShowtimeId}`);
    };

    if (loading) {
        return <div className="loading-page">Loading...</div>;
    }

    if (!showtime) {
        return <div className="error-page">Showtime not found</div>;
    }

    const showDate = new Date(showtime.showDate);
    const dateStr = showDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
    });

    return (
        <div className="booking-page-bms">
            {/* Header */}
            <div className="booking-header">
                <div className="header-left">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <FaArrowLeft />
                    </button>
                    <div className="movie-theater-info">
                        <h1>{showtime.movie?.title} - ({showtime.movie?.language || 'English'})</h1>
                        <p>{showtime.theater?.name}, {showtime.theater?.location} | {dateStr} | {showtime.showTime}</p>
                    </div>
                </div>
                <button className="tickets-btn">
                    <FaEdit /> {selectedSeats.length} Tickets
                </button>
            </div>

            {/* Showtime selector */}
            <div className="showtime-selector">
                {allShowtimes.map(st => (
                    <button
                        key={st._id}
                        className={`time-btn ${st._id === showtimeId ? 'active' : ''}`}
                        onClick={() => handleShowtimeChange(st._id)}
                    >
                        {st.showTime}
                    </button>
                ))}
            </div>

            {/* Seat Selection */}
            <SeatSelector
                theater={showtime.theater}
                bookedSeats={showtime.bookedSeats || []}
                selectedSeats={selectedSeats}
                onSeatSelect={setSelectedSeats}
                prices={{
                    vip: showtime.price?.vip || 480,
                    premium: showtime.price?.premium || 280,
                    regular: showtime.price?.regular || 260
                }}
            />

            {/* Bottom Bar */}
            {selectedSeats.length > 0 && (
                <div className="booking-bottom-bar">
                    <div className="selected-info">
                        <span className="seats">{selectedSeats.join(', ')}</span>
                        <span className="total">₹{calculateTotal()}</span>
                    </div>
                    <button className="proceed-btn" onClick={handleBooking}>
                        Pay ₹{calculateTotal()}
                    </button>
                </div>
            )}
        </div>
    );
};

export default BookingPage;
