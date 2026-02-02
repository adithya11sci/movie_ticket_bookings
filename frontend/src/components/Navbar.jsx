import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaFilm, FaUser, FaSignOutAlt, FaTicketAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <FaFilm className="logo-icon" />
                    <span>CineBook</span>
                </Link>

                <button 
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
                    <Link 
                        to="/" 
                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link 
                        to="/movies" 
                        className={`nav-link ${isActive('/movies') ? 'active' : ''}`}
                    >
                        Movies
                    </Link>
                    
                    {user ? (
                        <>
                            <Link 
                                to="/my-bookings" 
                                className={`nav-link ${isActive('/my-bookings') ? 'active' : ''}`}
                            >
                                <FaTicketAlt /> My Bookings
                            </Link>
                            
                            {user.role === 'admin' && (
                                <Link 
                                    to="/admin" 
                                    className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                                >
                                    <span className="admin-badge">Admin</span>
                                </Link>
                            )}
                            
                            <div className="user-menu">
                                <span className="user-name">
                                    <FaUser /> <span>{user.name}</span>
                                </span>
                                <button onClick={handleLogout} className="logout-btn">
                                    <FaSignOutAlt /> <span>Logout</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link btn-login">
                                Login
                            </Link>
                            <Link to="/register" className="btn-register">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
