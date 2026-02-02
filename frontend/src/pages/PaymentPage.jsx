import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import {
    FaCreditCard,
    FaLock,
    FaMobileAlt,
    FaUniversity,
    FaWallet,
    FaCheckCircle,
    FaTicketAlt,
    FaClock,
    FaMapMarkerAlt,
    FaChair,
    FaArrowRight,
    FaShieldAlt,
    FaGooglePay,
    FaApplePay,
    FaAmazonPay
} from 'react-icons/fa';
import { SiPaytm, SiPhonepe } from 'react-icons/si';
import './PaymentPage.css';

const PaymentPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [expandedMethod, setExpandedMethod] = useState('card');

    // Payment form states
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedWallet, setSelectedWallet] = useState('');

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

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(' ') : value;
    };

    // Handle payment
    const handlePayment = async (e) => {
        e.preventDefault();

        // Validation based on payment method
        if (selectedMethod === 'card') {
            if (!cardNumber || !expiryDate || !cvv || !cardName) {
                toast.error('Please fill all card details');
                return;
            }
        } else if (selectedMethod === 'upi') {
            if (!upiId) {
                toast.error('Please enter your UPI ID');
                return;
            }
        } else if (selectedMethod === 'netbanking') {
            if (!selectedBank) {
                toast.error('Please select a bank');
                return;
            }
        } else if (selectedMethod === 'wallet') {
            if (!selectedWallet) {
                toast.error('Please select a wallet');
                return;
            }
        }

        setProcessing(true);

        // Simulate payment processing
        setTimeout(async () => {
            try {
                await API.put(`/bookings/${bookingId}/payment`, {
                    paymentStatus: 'completed',
                    paymentId: 'PAY_' + Date.now(),
                    paymentMethod: selectedMethod
                });

                toast.success('Payment successful! Booking confirmed');
                navigate('/my-bookings');
            } catch (error) {
                toast.error('Payment failed. Please try again.');
            } finally {
                setProcessing(false);
            }
        }, 2000);
    };

    const banks = [
        { id: 'sbi', name: 'State Bank of India', icon: '🏦' },
        { id: 'hdfc', name: 'HDFC Bank', icon: '🏦' },
        { id: 'icici', name: 'ICICI Bank', icon: '🏦' },
        { id: 'axis', name: 'Axis Bank', icon: '🏦' },
        { id: 'kotak', name: 'Kotak Mahindra Bank', icon: '🏦' },
        { id: 'bob', name: 'Bank of Baroda', icon: '🏦' }
    ];

    const wallets = [
        { id: 'paytm', name: 'Paytm', icon: <SiPaytm /> },
        { id: 'phonepe', name: 'PhonePe', icon: <SiPhonepe /> },
        { id: 'amazon', name: 'Amazon Pay', icon: <FaAmazonPay /> },
        { id: 'mobikwik', name: 'MobiKwik', icon: <FaWallet /> }
    ];

    if (loading) {
        return (
            <div className="loading-page">
                <div className="loader"></div>
                <p>Loading payment details...</p>
            </div>
        );
    }

    if (!booking) {
        return <div className="error-page">Booking not found</div>;
    }

    return (
        <div className="payment-page">
            <div className="payment-container">
                {/* Left Side - Movie & Booking Info */}
                <div className="payment-left">
                    <div className="booking-summary-card">
                        <div className="summary-header">
                            <FaTicketAlt className="ticket-icon" />
                            <h2>Booking Summary</h2>
                        </div>

                        <div className="movie-info-section">
                            <div className="movie-poster">
                                <img
                                    src={booking.showTime?.movie?.posterUrl}
                                    alt={booking.showTime?.movie?.title}
                                />
                            </div>
                            <div className="movie-details">
                                <h3 className="movie-title">{booking.showTime?.movie?.title}</h3>
                                <span className="movie-badge">{booking.showTime?.movie?.rating >= 7 ? 'UA' : 'A'}</span>
                                <p className="movie-lang">{booking.showTime?.movie?.language || 'English'} • 2D</p>
                            </div>
                        </div>

                        <div className="booking-details">
                            <div className="detail-item">
                                <FaMapMarkerAlt className="detail-icon" />
                                <div>
                                    <span className="detail-label">Theater</span>
                                    <span className="detail-value">{booking.showTime?.theater?.name}</span>
                                    <span className="detail-sub">{booking.showTime?.theater?.location}</span>
                                </div>
                            </div>

                            <div className="detail-item">
                                <FaClock className="detail-icon" />
                                <div>
                                    <span className="detail-label">Date & Time</span>
                                    <span className="detail-value">
                                        {new Date(booking.showTime?.showDate).toLocaleDateString('en-IN', {
                                            weekday: 'short',
                                            day: 'numeric',
                                            month: 'short'
                                        })}
                                    </span>
                                    <span className="detail-sub">{booking.showTime?.showTime}</span>
                                </div>
                            </div>

                            <div className="detail-item">
                                <FaChair className="detail-icon" />
                                <div>
                                    <span className="detail-label">Seats ({booking.totalSeats})</span>
                                    <span className="detail-value seats-list">
                                        {booking.seats?.map(s => s.seatNumber).join(', ')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="price-summary">
                            <div className="price-row">
                                <span>Ticket Price ({booking.totalSeats} tickets)</span>
                                <span>₹{booking.totalAmount}</span>
                            </div>
                            <div className="price-row">
                                <span>Convenience Fee</span>
                                <span className="free">FREE</span>
                            </div>
                            <div className="price-row">
                                <span>Discount</span>
                                <span className="discount">-₹0</span>
                            </div>
                            <div className="price-row total">
                                <span>Amount Payable</span>
                                <span className="total-amount">₹{booking.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Offers Section */}
                    <div className="offers-card">
                        <h4>🎉 Available Offers</h4>
                        <div className="offer-item">
                            <span className="offer-badge">FIRST</span>
                            <p>Get 10% off on your first booking!</p>
                        </div>
                        <div className="offer-item">
                            <span className="offer-badge">UPI</span>
                            <p>Extra ₹50 cashback on UPI payments</p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Payment Methods */}
                <div className="payment-right">
                    <div className="payment-methods-card">
                        <h2><FaCreditCard /> Select Payment Method</h2>

                        <form onSubmit={handlePayment}>
                            {/* Credit/Debit Card */}
                            <div
                                className={`payment-method ${selectedMethod === 'card' ? 'active' : ''}`}
                                onClick={() => { setSelectedMethod('card'); setExpandedMethod('card'); }}
                            >
                                <div className="method-header">
                                    <div className="method-radio">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={selectedMethod === 'card'}
                                            onChange={() => setSelectedMethod('card')}
                                        />
                                    </div>
                                    <FaCreditCard className="method-icon" />
                                    <div className="method-info">
                                        <h4>Credit / Debit Card</h4>
                                        <p>Visa, Mastercard, Rupay & more</p>
                                    </div>
                                    <div className="card-icons">
                                        <span className="card-brand visa">VISA</span>
                                        <span className="card-brand mc">MC</span>
                                        <span className="card-brand rupay">RuPay</span>
                                    </div>
                                </div>

                                {expandedMethod === 'card' && selectedMethod === 'card' && (
                                    <div className="method-content">
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
                                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
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
                                                    placeholder="•••"
                                                    maxLength="4"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* UPI */}
                            <div
                                className={`payment-method ${selectedMethod === 'upi' ? 'active' : ''}`}
                                onClick={() => { setSelectedMethod('upi'); setExpandedMethod('upi'); }}
                            >
                                <div className="method-header">
                                    <div className="method-radio">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={selectedMethod === 'upi'}
                                            onChange={() => setSelectedMethod('upi')}
                                        />
                                    </div>
                                    <FaMobileAlt className="method-icon" />
                                    <div className="method-info">
                                        <h4>UPI</h4>
                                        <p>Google Pay, PhonePe, Paytm & more</p>
                                    </div>
                                    <div className="upi-icons">
                                        <FaGooglePay className="upi-brand" />
                                        <SiPhonepe className="upi-brand" />
                                        <SiPaytm className="upi-brand" />
                                    </div>
                                </div>

                                {expandedMethod === 'upi' && selectedMethod === 'upi' && (
                                    <div className="method-content">
                                        <div className="form-group">
                                            <label>Enter UPI ID</label>
                                            <input
                                                type="text"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                placeholder="yourname@upi"
                                            />
                                        </div>
                                        <div className="upi-apps">
                                            <p>Or pay using UPI apps:</p>
                                            <div className="upi-app-list">
                                                <button type="button" className="upi-app">
                                                    <FaGooglePay /> GPay
                                                </button>
                                                <button type="button" className="upi-app">
                                                    <SiPhonepe /> PhonePe
                                                </button>
                                                <button type="button" className="upi-app">
                                                    <SiPaytm /> Paytm
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Net Banking */}
                            <div
                                className={`payment-method ${selectedMethod === 'netbanking' ? 'active' : ''}`}
                                onClick={() => { setSelectedMethod('netbanking'); setExpandedMethod('netbanking'); }}
                            >
                                <div className="method-header">
                                    <div className="method-radio">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={selectedMethod === 'netbanking'}
                                            onChange={() => setSelectedMethod('netbanking')}
                                        />
                                    </div>
                                    <FaUniversity className="method-icon" />
                                    <div className="method-info">
                                        <h4>Net Banking</h4>
                                        <p>All major banks supported</p>
                                    </div>
                                </div>

                                {expandedMethod === 'netbanking' && selectedMethod === 'netbanking' && (
                                    <div className="method-content">
                                        <div className="bank-grid">
                                            {banks.map(bank => (
                                                <div
                                                    key={bank.id}
                                                    className={`bank-option ${selectedBank === bank.id ? 'selected' : ''}`}
                                                    onClick={(e) => { e.stopPropagation(); setSelectedBank(bank.id); }}
                                                >
                                                    <span className="bank-icon">{bank.icon}</span>
                                                    <span className="bank-name">{bank.name}</span>
                                                    {selectedBank === bank.id && <FaCheckCircle className="check-icon" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Wallets */}
                            <div
                                className={`payment-method ${selectedMethod === 'wallet' ? 'active' : ''}`}
                                onClick={() => { setSelectedMethod('wallet'); setExpandedMethod('wallet'); }}
                            >
                                <div className="method-header">
                                    <div className="method-radio">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={selectedMethod === 'wallet'}
                                            onChange={() => setSelectedMethod('wallet')}
                                        />
                                    </div>
                                    <FaWallet className="method-icon" />
                                    <div className="method-info">
                                        <h4>Wallets</h4>
                                        <p>Paytm, PhonePe, Amazon Pay & more</p>
                                    </div>
                                </div>

                                {expandedMethod === 'wallet' && selectedMethod === 'wallet' && (
                                    <div className="method-content">
                                        <div className="wallet-grid">
                                            {wallets.map(wallet => (
                                                <div
                                                    key={wallet.id}
                                                    className={`wallet-option ${selectedWallet === wallet.id ? 'selected' : ''}`}
                                                    onClick={(e) => { e.stopPropagation(); setSelectedWallet(wallet.id); }}
                                                >
                                                    <span className="wallet-icon">{wallet.icon}</span>
                                                    <span className="wallet-name">{wallet.name}</span>
                                                    {selectedWallet === wallet.id && <FaCheckCircle className="check-icon" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Pay Button */}
                            <button type="submit" className="pay-btn" disabled={processing}>
                                {processing ? (
                                    <>
                                        <div className="spinner"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay ₹{booking.totalAmount}
                                        <FaArrowRight />
                                    </>
                                )}
                            </button>

                            <div className="secure-badge">
                                <FaShieldAlt />
                                <span>100% Secure Payments</span>
                                <FaLock />
                                <span>256-bit SSL Encrypted</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
