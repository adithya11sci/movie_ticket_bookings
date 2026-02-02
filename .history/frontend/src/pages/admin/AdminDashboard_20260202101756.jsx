import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axios';
import { FaFilm, FaTheaterMasks, FaCalendarAlt, FaUsers, FaChartBar, FaTicketAlt } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // check if user is admin
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchStats();
    }, [user]);

    const fetchStats = async () => {
        try {
            const res = await API.get('/admin/stats');
            setStats(res.data);
        } catch (error) {
            console.log('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-page">Loading...</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-sidebar">
                <h2>Admin Panel</h2>
                <nav>
                    <Link to="/admin" className="nav-item">
                        <FaChartBar /> Dashboard
                    </Link>
                    <Link to="/admin/movies" className="nav-item">
                        <FaFilm /> Movies
                    </Link>
                    <Link to="/admin/theaters" className="nav-item">
                        <FaTheaterMasks /> Theaters
                    </Link>
                    <Link to="/admin/showtimes" className="nav-item">
                        <FaCalendarAlt /> Showtimes
                    </Link>
                    <Link to="/admin/bookings" className="nav-item">
                        <FaTicketAlt /> Bookings
                    </Link>
                    <Link to="/admin/users" className="nav-item">
                        <FaUsers /> Users
                    </Link>
                </nav>
            </div>

            <div className="admin-content">
                {/* Stats cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon movies">
                            <FaFilm />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.stats?.totalMovies || 0}</h3>
                            <p>Movies</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon theaters">
                            <FaTheaterMasks />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.stats?.totalTheaters || 0}</h3>
                            <p>Theaters</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon bookings">
                            <FaTicketAlt />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.stats?.totalBookings || 0}</h3>
                            <p>Bookings</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon revenue">
                            <FaChartBar />
                        </div>
                        <div className="stat-info">
                            <h3>₹{stats?.stats?.totalRevenue || 0}</h3>
                            <p>Revenue</p>
                        </div>
                    </div>
                </div>

                {/* Recent bookings */}
                <div className="recent-section">
                    <h3>Recent Bookings</h3>
                    <div className="bookings-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Movie</th>
                                    <th>Seats</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recentBookings?.map(booking => (
                                    <tr key={booking._id}>
                                        <td>{booking.user?.name}</td>
                                        <td>{booking.showTime?.movie?.title}</td>
                                        <td>{booking.totalSeats}</td>
                                        <td>₹{booking.totalAmount}</td>
                                        <td>
                                            <span className={`status ${booking.bookingStatus}`}>
                                                {booking.bookingStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
