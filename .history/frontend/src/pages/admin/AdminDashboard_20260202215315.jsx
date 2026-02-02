import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axios';
import { 
    FaFilm, 
    FaTheaterMasks, 
    FaCalendarAlt, 
    FaUsers, 
    FaChartBar, 
    FaTicketAlt,
    FaRupeeSign,
    FaChair,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaSync,
    FaHome,
    FaEye,
    FaArrowLeft
} from 'react-icons/fa';
import './AdminDashboard.css';

/**
 * AdminDashboard Component
 * --------------------------
 * Main dashboard for admin users showing:
 * - Real-time statistics (revenue, bookings, seats, users)
 * - Booking status breakdown (confirmed, pending, cancelled)
 * - Recent bookings table
 * - Top performing movies
 * - Quick action links
 * 
 * Features:
 * - Auto-refresh every 30 seconds for real-time data
 * - Admin-only access protection
 * - Responsive sidebar navigation
 */
const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        // Security check: Only admin users can access this page
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchStats();
        
        // Auto-refresh every 30 seconds for real-time monitoring
        const interval = setInterval(() => {
            fetchStats(true);
        }, 30000);
        
        return () => clearInterval(interval);
    }, [user]);

    /**
     * Fetch dashboard statistics from the admin API
     * @param {boolean} silent - If true, don't show loading state
     */
    const fetchStats = async (silent = false) => {
        if (!silent) setLoading(true);
        setRefreshing(true);
        
        try {
            const res = await API.get('/admin/stats');
            setStats(res.data);
            setLastUpdated(new Date());
        } catch (error) {
            console.log('Error fetching stats:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    /**
     * Format amount as Indian Rupee currency
     */
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    /**
     * Check if navigation link is active
     */
    const isActive = (path) => {
        return location.pathname === path;
    };

    // Loading state
    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading Admin Dashboard...</p>
            </div>
        );
    }

    // Extract booking stats by status
    const confirmedBookings = stats?.bookingStats?.find(s => s._id === 'confirmed')?.count || 0;
    const cancelledBookings = stats?.bookingStats?.find(s => s._id === 'cancelled')?.count || 0;
    const pendingBookings = stats?.bookingStats?.find(s => s._id === 'pending')?.count || 0;

    return (
        <div className="admin-layout">
            {/* ==================== Sidebar Navigation ==================== */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <FaChartBar className="logo-icon" />
                    <h2>Admin Panel</h2>
                </div>
                
                <nav className="sidebar-nav">
                    <Link to="/admin" className={`nav-item ${isActive('/admin') ? 'active' : ''}`}>
                        <FaHome /> <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/movies" className={`nav-item ${isActive('/admin/movies') ? 'active' : ''}`}>
                        <FaFilm /> <span>Movies</span>
                    </Link>
                    <Link to="/admin/theaters" className={`nav-item ${isActive('/admin/theaters') ? 'active' : ''}`}>
                        <FaTheaterMasks /> <span>Theaters</span>
                    </Link>
                    <Link to="/admin/showtimes" className={`nav-item ${isActive('/admin/showtimes') ? 'active' : ''}`}>
                        <FaCalendarAlt /> <span>Showtimes</span>
                    </Link>
                    <Link to="/admin/bookings" className={`nav-item ${isActive('/admin/bookings') ? 'active' : ''}`}>
                        <FaTicketAlt /> <span>Bookings</span>
                    </Link>
                    <Link to="/admin/seats" className={`nav-item ${isActive('/admin/seats') ? 'active' : ''}`}>
                        <FaChair /> <span>Seat Monitor</span>
                    </Link>
                    <Link to="/admin/users" className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}>
                        <FaUsers /> <span>Users</span>
                    </Link>
                </nav>
                
                <div className="sidebar-footer">
                    <Link to="/" className="back-to-site">
                        <FaArrowLeft />
                        <span>Back to Site</span>
                    </Link>
                </div>
            </aside>

            {/* ==================== Main Content Area ==================== */}
            <main className="admin-main">
                {/* Header with refresh and user info */}
                <header className="admin-header">
                    <div className="header-left">
                        <h1>Dashboard Overview</h1>
                        <p className="last-updated">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                            {refreshing && <FaSync className="spin" />}
                        </p>
                    </div>
                    <div className="header-right">
                        <button className="refresh-btn" onClick={() => fetchStats()} disabled={refreshing}>
                            <FaSync className={refreshing ? 'spin' : ''} />
                            Refresh
                        </button>
                        <div className="admin-user">
                            <span>Welcome, {user?.name}</span>
                            <span className="admin-badge">Admin</span>
                        </div>
                    </div>
                </header>

                {/* ==================== Statistics Cards ==================== */}
                <div className="stats-grid">
                    {/* Total Revenue Card */}
                    <div className="stat-card primary">
                        <div className="stat-icon">
                            <FaRupeeSign />
                        </div>
                        <div className="stat-content">
                            <h3>{formatCurrency(stats?.stats?.totalRevenue || 0)}</h3>
                            <p>Total Revenue</p>
                            <span className="stat-sub">
                                Today: {formatCurrency(stats?.stats?.todayRevenue || 0)}
                            </span>
                        </div>
                    </div>
                    
                    {/* Total Bookings Card */}
                    <div className="stat-card success">
                        <div className="stat-icon">
                            <FaTicketAlt />
                        </div>
                        <div className="stat-content">
                            <h3>{stats?.stats?.totalBookings || 0}</h3>
                            <p>Total Bookings</p>
                            <span className="stat-sub">
                                <FaCheckCircle /> {confirmedBookings} Confirmed
                            </span>
                        </div>
                    </div>
                    
                    {/* Seats Booked Card - Shows real-time seat availability */}
                    <div className="stat-card info">
                        <div className="stat-icon">
                            <FaChair />
                        </div>
                        <div className="stat-content">
                            <h3>{stats?.stats?.totalBookedSeats || 0}</h3>
                            <p>Seats Booked</p>
                            <span className="stat-sub">
                                Capacity: {stats?.stats?.totalSeatsCapacity || 0}
                            </span>
                        </div>
                    </div>
                    
                    {/* Registered Users Card */}
                    <div className="stat-card warning">
                        <div className="stat-icon">
                            <FaUsers />
                        </div>
                        <div className="stat-content">
                            <h3>{stats?.stats?.totalUsers || 0}</h3>
                            <p>Registered Users</p>
                            <span className="stat-sub">Active accounts</span>
                        </div>
                    </div>
                    
                    {/* Movies Card */}
                    <div className="stat-card secondary">
                        <div className="stat-icon">
                            <FaFilm />
                        </div>
                        <div className="stat-content">
                            <h3>{stats?.stats?.totalMovies || 0}</h3>
                            <p>Movies</p>
                            <span className="stat-sub">
                                {stats?.stats?.activeMovies || 0} Active
                            </span>
                        </div>
                    </div>
                    
                    {/* Theaters Card */}
                    <div className="stat-card dark">
                        <div className="stat-icon">
                            <FaTheaterMasks />
                        </div>
                        <div className="stat-content">
                            <h3>{stats?.stats?.totalTheaters || 0}</h3>
                            <p>Theaters</p>
                            <span className="stat-sub">All locations</span>
                        </div>
                    </div>
                </div>

                {/* ==================== Booking Status Summary ==================== */}
                <div className="booking-status-row">
                    <div className="status-card confirmed">
                        <FaCheckCircle />
                        <div>
                            <h4>{confirmedBookings}</h4>
                            <p>Confirmed</p>
                        </div>
                    </div>
                    <div className="status-card pending">
                        <FaClock />
                        <div>
                            <h4>{pendingBookings}</h4>
                            <p>Pending</p>
                        </div>
                    </div>
                    <div className="status-card cancelled">
                        <FaTimesCircle />
                        <div>
                            <h4>{cancelledBookings}</h4>
                            <p>Cancelled</p>
                        </div>
                    </div>
                </div>

                {/* ==================== Dashboard Grid (Bookings + Top Movies) ==================== */}
                <div className="dashboard-grid">
                    {/* Recent Bookings Table */}
                    <div className="dashboard-card recent-bookings">
                        <div className="card-header">
                            <h3><FaTicketAlt /> Recent Bookings</h3>
                            <Link to="/admin/bookings" className="view-all">
                                View All <FaEye />
                            </Link>
                        </div>
                        <div className="bookings-table-wrapper">
                            <table className="data-table">
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
                                    {stats?.recentBookings?.slice(0, 8).map(booking => (
                                        <tr key={booking._id}>
                                            <td>
                                                <div className="user-info">
                                                    <span className="user-name">{booking.user?.name}</span>
                                                    <span className="user-email">{booking.user?.email}</span>
                                                </div>
                                            </td>
                                            <td>{booking.showTime?.movie?.title || 'N/A'}</td>
                                            <td>{booking.totalSeats}</td>
                                            <td className="amount">{formatCurrency(booking.totalAmount)}</td>
                                            <td>
                                                <span className={`status-badge ${booking.bookingStatus}`}>
                                                    {booking.bookingStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!stats?.recentBookings || stats.recentBookings.length === 0) && (
                                        <tr>
                                            <td colSpan="5" className="no-data">No bookings yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Movies by Revenue */}
                    <div className="dashboard-card top-movies">
                        <div className="card-header">
                            <h3><FaFilm /> Top Movies</h3>
                        </div>
                        <div className="top-movies-list">
                            {stats?.topMovies?.map((movie, index) => (
                                <div key={movie._id} className="top-movie-item">
                                    <span className="rank">#{index + 1}</span>
                                    <div className="movie-poster-small">
                                        <img src={movie.posterUrl} alt={movie.title} />
                                    </div>
                                    <div className="movie-details">
                                        <h4>{movie.title}</h4>
                                        <p>{movie.bookings} bookings • {movie.seats} seats</p>
                                    </div>
                                    <div className="movie-revenue">
                                        {formatCurrency(movie.revenue)}
                                    </div>
                                </div>
                            ))}
                            {(!stats?.topMovies || stats.topMovies.length === 0) && (
                                <p className="no-data">No booking data yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ==================== Quick Actions ==================== */}
                <div className="quick-actions">
                    <h3>Quick Actions</h3>
                    <div className="actions-grid">
                        <Link to="/admin/movies" className="action-card">
                            <FaFilm />
                            <span>Manage Movies</span>
                        </Link>
                        <Link to="/admin/showtimes" className="action-card">
                            <FaCalendarAlt />
                            <span>Manage Showtimes</span>
                        </Link>
                        <Link to="/admin/theaters" className="action-card">
                            <FaTheaterMasks />
                            <span>Manage Theaters</span>
                        </Link>
                        <Link to="/admin/seats" className="action-card">
                            <FaChair />
                            <span>Monitor Seats</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
