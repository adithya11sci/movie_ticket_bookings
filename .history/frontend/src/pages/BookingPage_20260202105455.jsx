import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import SeatSelector from '../components/SeatSelector';
import { toast } from 'react-toastify';
import './BookingPage.css';

const BookingPage = () => {
    const { showtimeId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const [showtime, setShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // redirect if not logged in
        if (!user) {
            toast.error('Please login to book tickets');
            navigate('/login');
            return;
        }
        fetchShowtime();
    }, [showtimeId, user]);

    const fetchShowtime = async () => {
        try {
            const res = await API.get(`/showtimes/${showtimeId}`);
            setShowtime(res.data);
        } catch (error) {
            console.log('Error:', error);
            toast.error('Failed to load showtime');
        } finally {
            setLoading(false);
        }
    };

    // calculate total price
    const calculateTotal = () => {
        if (!showtime) return 0;
        return selectedSeats.length * showtime.price.regular;
    };

    // handle booking
    const handleBooking = async () => {
        if (selectedSeats.length === 0) {
            toast.error('Please select atleast one seat');
            return;
        }

        try {
            const bookingData = {
                showTimeId: showtimeId,
                seats: selectedSeats.map(seat => ({
                    seatNumber: seat,
                    seatType: 'regular'
                })),
                totalAmount: calculateTotal()
            };

            const res = await API.post('/bookings', bookingData);
            toast.success('Booking created! Proceed to payment');
            navigate(`/payment/${res.data.booking._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed');
        }
    };

    if (loading) {
        return <div className="loading-page">Loading...</div>;
    }

    if (!showtime) {
        return <div className="error-page">Showtime not found</div>;
    }

    return (
        <div className="booking-page">
            <div className="booking-container">
                {/* movie info */}
                <div className="booking-movie-info">
                    <img src={showtime.movie?.posterUrl} alt={showtime.movie?.title} />
                    <div className="info">
                        <h2>{showtime.movie?.title}</h2>
                        <p>{showtime.theater?.name} - {showtime.theater?.location}</p>
                        <p className="showtime-info">
                            {new Date(showtime.showDate).toLocaleDateString()} | {showtime.showTime}
                        </p>
                    </div>
                </div>

                {/* seat selection */}
                <SeatSelector
                    theater={showtime.theater}
                    bookedSeats={showtime.bookedSeats || []}
                    selectedSeats={selectedSeats}
                    onSeatSelect={setSelectedSeats}
                />

                {/* booking summary */}
                <div className="booking-summary">
                    <div className="summary-details">
                        <p>Selected Seats: <span>{selectedSeats.join(', ') || 'None'}</span></p>
                        <p>Number of Tickets: <span>{selectedSeats.length}</span></p>
                        <p>Price per Ticket: <span>₹{showtime.price?.regular}</span></p>
                        <p className="total">Total: <span>₹{calculateTotal()}</span></p>
                    </div>
                    <button 
                        className="proceed-btn"
                        onClick={handleBooking}
                        disabled={selectedSeats.length === 0}
                    >
                        Proceed to Pay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
