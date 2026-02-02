import { Link } from 'react-router-dom';
import { FaStar, FaPlay, FaTicketAlt } from 'react-icons/fa';
import './MovieCard.css';

const MovieCard = ({ movie, index = 0 }) => {
    const animationDelay = `${index * 0.1}s`;

    return (
        <div className="movie-card" style={{ animationDelay }}>
            <div className="movie-poster">
                {/* show now showing or coming soon badge */}
                {movie.isNowShowing ? (
                    <span className="now-showing-badge">Now Showing</span>
                ) : (
                    <span className="coming-soon-badge">Coming Soon</span>
                )}

                {/* language badge */}
                <span className="language-badge">{movie.language || 'English'}</span>

                <img
                    src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'}
                    alt={movie.title}
                    loading="lazy"
                />

                <div className="movie-overlay">
                    <Link to={`/movie/${movie._id}`} className="book-btn">
                        <FaTicketAlt /> Book Now
                    </Link>
                </div>
            </div>

            <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-meta">
                    <span className="genre">{movie.genre?.slice(0, 2).join(' • ')}</span>
                    <span className="duration">{movie.duration} min</span>
                </div>
                <div className="movie-rating">
                    <FaStar className="star" />
                    <span>{movie.rating || 0}/10</span>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;

