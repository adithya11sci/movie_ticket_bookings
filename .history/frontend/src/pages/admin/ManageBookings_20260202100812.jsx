import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import './AdminPages.css';

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await API.get('/bookings');
            setBookings(res.data);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="admin-page">
            <div className="page-header">
                <h2>All Bookings</h2>
            </div>

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
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking._id}>
                                <td>{booking._id.slice(-8)}</td>
                                <td>{booking.user?.name}<br/><small>{booking.user?.email}</small></td>
                                <td>{booking.showTime?.movie?.title}</td>
                                <td>{booking.showTime?.theater?.name}</td>
                                <td>{booking.seats?.map(s => s.seatNumber).join(', ')}</td>
                                <td>₹{booking.totalAmount}</td>
                                <td>
                                    <span className={`status ${booking.paymentStatus}`}>
                                        {booking.paymentStatus}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status ${booking.bookingStatus}`}>
                                        {booking.bookingStatus}
                                    </span>
                                </td>
                                <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageBookings;
