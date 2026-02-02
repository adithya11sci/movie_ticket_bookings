import { Link } from 'react-router-dom';
import { FaStar, FaPlay, FaTicketAlt } from 'react-icons/fa';
import './MovieCard.css';

const MovieCard = ({ movie, index = 0 }) => {
    const animationDelay = `${index * 0.1}s`;

    return (
        <div className="movie-card" style={{ animationDelay }}>
            <div className="poster-container">
                {/* Rating badge */}
                <div className="rating-badge">
                    <FaStar /> {movie.rating || 0}/10
                </div>

                {/* Now showing or coming soon badge */}
                {movie.isNowShowing ? (
                    <span className="now-showing-badge">Now Showing</span>
                ) : (
                    <span className="coming-soon-badge">Coming Soon</span>
                )}

                <img
                    className="movie-poster"
                    src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'}
                    alt={movie.title}
                    loading="lazy"
                />

                <div className="poster-overlay">
                    <div className="overlay-buttons">
                        <button className="play-btn">
                            <FaPlay /> Trailer
                        </button>
                        <Link to={`/movie/${movie._id}`} className="book-btn">
                            <FaTicketAlt /> Book Now
                        </Link>
                    </div>
                </div>
            </div>

            <div className="movie-info">
                <h3>{movie.title}</h3>
                <div className="movie-genres">
                    {movie.genre?.slice(0, 2).map((g, i) => (
                        <span key={i} className="genre-tag">{g}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieCard;

