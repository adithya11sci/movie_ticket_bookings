import { Link } from 'react-router-dom';
import { FaFilm, FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3><FaFilm /> MovieBook</h3>
                    <p>Your one stop destination for booking movie tickets online. Experience cinema like never before.</p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/movies">Movies</Link></li>
                        <li><Link to="/my-bookings">My Bookings</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Help</h4>
                    <ul>
                        <li><a href="#">FAQs</a></li>
                        <li><a href="#">Terms & Conditions</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Connect With Us</h4>
                    <div className="social-links">
                        <a href="#"><FaFacebook /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaEnvelope /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2026 MovieBook. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
