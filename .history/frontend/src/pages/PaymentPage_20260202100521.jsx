import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { FaCreditCard, FaLock } from 'react-icons/fa';
import './PaymentPage.css';

const PaymentPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    
    // payment form state
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');

    useEffect(() => {
        fetchBooking();
    }, [bookingId]);

    const fetchBooking = async () => {
        try {
            const res = await API.get(`/bookings/${bookingId}`);
            setBooking(res.data);
        } catch (error) {
            toast.error('Failed to load booking');
        } finally {
            setLoading(false);
        }
    };

    // handle payment (sample - not real payment)
    const handlePayment = async (e) => {
        e.preventDefault();
        
        // basic validation
        if (!cardNumber || !expiryDate || !cvv || !cardName) {
            toast.error('Please fill all payment details');
            return;
        }

        setProcessing(true);
        
        // simulate payment processing
        setTimeout(async () => {
            try {
                // update payment status
                await API.put(`/bookings/${bookingId}/payment`, {
                    paymentStatus: 'completed',
                    paymentId: 'PAY_' + Date.now()
                });
                
                toast.success('Payment successful! Booking confirmed');
                navigate('/my-bookings');
            } catch (error) {
                toast.error('Payment failed');
            } finally {
                setProcessing(false);
            }
        }, 2000);
    };

    if (loading) {
        return <div className="loading-page">Loading...</div>;
    }

    if (!booking) {
        return <div className="error-page">Booking not found</div>;
    }

    return (
        <div className="payment-page">
            <div className="payment-container">
                <div className="payment-left">
                    <h2><FaCreditCard /> Payment Details</h2>
                    
                    <form onSubmit={handlePayment}>
                        <div className="form-group">
                            <label>Card Holder Name</label>
                            <input
                                type="text"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                placeholder="Name on card"
                            />
                        </div>

                        <div className="form-group">
                            <label>Card Number</label>
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="1234 5678 9012 3456"
                                maxLength="19"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Expiry Date</label>
                                <input
                                    type="text"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    placeholder="MM/YY"
                                    maxLength="5"
                                />
                            </div>
                            <div className="form-group">
                                <label>CVV</label>
                                <input
                                    type="password"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    placeholder="***"
                                    maxLength="3"
                                />
                            </div>
                        </div>

                        <button type="submit" className="pay-btn" disabled={processing}>
                            {processing ? 'Processing...' : `Pay ₹${booking.totalAmount}`}
                        </button>
                        
                        <p className="secure-text">
                            <FaLock /> Your payment is secure and encrypted
                        </p>
                    </form>
                </div>

                <div className="payment-right">
                    <h3>Booking Summary</h3>
                    <div className="summary-card">
                        <img 
                            src={booking.showTime?.movie?.posterUrl} 
                            alt={booking.showTime?.movie?.title} 
                        />
                        <div className="summary-info">
                            <h4>{booking.showTime?.movie?.title}</h4>
                            <p>{booking.showTime?.theater?.name}</p>
                            <p>{new Date(booking.showTime?.showDate).toLocaleDateString()} | {booking.showTime?.showTime}</p>
                            <p className="seats-info">
                                Seats: {booking.seats?.map(s => s.seatNumber).join(', ')}
                            </p>
                        </div>
                    </div>
                    
                    <div className="price-breakdown">
                        <div className="price-row">
                            <span>Tickets ({booking.totalSeats})</span>
                            <span>₹{booking.totalAmount}</span>
                        </div>
                        <div className="price-row">
                            <span>Convenience Fee</span>
                            <span>₹0</span>
                        </div>
                        <div className="price-row total">
                            <span>Total</span>
                            <span>₹{booking.totalAmount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
