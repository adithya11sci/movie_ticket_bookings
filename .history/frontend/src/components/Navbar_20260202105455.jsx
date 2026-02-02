import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaFilm, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <FaFilm /> MovieBook
                </Link>

                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/movies" className="nav-link">Movies</Link>
                    
                    {user ? (
                        <>
                            <Link to="/my-bookings" className="nav-link">My Bookings</Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="nav-link">Admin</Link>
                            )}
                            <div className="user-menu">
                                <span className="user-name">
                                    <FaUser /> {user.name}
                                </span>
                                <button onClick={handleLogout} className="logout-btn">
                                    <FaSignOutAlt /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link btn-register">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
