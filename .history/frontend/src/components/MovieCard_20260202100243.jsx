import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
    return (
        <div className="movie-card">
            <div className="movie-poster">
                <img src={movie.posterUrl} alt={movie.title} />
                <div className="movie-overlay">
                    <Link to={`/movie/${movie._id}`} className="book-btn">
                        Book Now
                    </Link>
                </div>
            </div>
            <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-meta">
                    <span className="genre">{movie.genre?.join(', ')}</span>
                    <span className="duration">{movie.duration} min</span>
                </div>
                <div className="movie-rating">
                    ⭐ {movie.rating}/10
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
