import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { FaClock, FaLanguage, FaCalendar, FaStar } from 'react-icons/fa';
import './MovieDetails.css';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        fetchMovieDetails();
    }, [id]);

    const fetchMovieDetails = async () => {
        try {
            const [movieRes, showtimeRes] = await Promise.all([
                API.get(`/movies/${id}`),
                API.get(`/showtimes/movie/${id}`)
            ]);
            setMovie(movieRes.data);
            setShowtimes(showtimeRes.data);
        } catch (error) {
            console.log('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // get unique dates from showtimes
    const getUniqueDates = () => {
        const dates = showtimes.map(st => 
            new Date(st.showDate).toLocaleDateString()
        );
        return [...new Set(dates)];
    };

    // filter showtimes by selected date
    const filteredShowtimes = selectedDate
        ? showtimes.filter(st => 
            new Date(st.showDate).toLocaleDateString() === selectedDate
        )
        : showtimes;

    const handleShowtimeSelect = (showtimeId) => {
        navigate(`/booking/${showtimeId}`);
    };

    if (loading) {
        return <div className="loading-page">Loading...</div>;
    }

    if (!movie) {
        return <div className="error-page">Movie not found</div>;
    }

    return (
        <div className="movie-details">
            <div className="movie-banner" style={{ 
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(15,15,35,1)), url(${movie.posterUrl})`
            }}>
                <div className="banner-content">
                    <img src={movie.posterUrl} alt={movie.title} className="movie-poster-large" />
                    <div className="movie-info-details">
                        <h1>{movie.title}</h1>
                        <div className="movie-meta-info">
                            <span><FaStar className="icon" /> {movie.rating}/10</span>
                            <span><FaClock className="icon" /> {movie.duration} min</span>
                            <span><FaLanguage className="icon" /> {movie.language}</span>
                            <span><FaCalendar className="icon" /> {new Date(movie.releaseDate).toLocaleDateString()}</span>
                        </div>
                        <div className="genres">
                            {movie.genre?.map((g, i) => (
                                <span key={i} className="genre-tag">{g}</span>
                            ))}
                        </div>
                        <p className="description">{movie.description}</p>
                    </div>
                </div>
            </div>

            {/* showtimes section */}
            <div className="showtimes-section">
                <h2>Select Showtime</h2>
                
                {/* date selector */}
                <div className="date-selector">
                    {getUniqueDates().map(date => (
                        <button
                            key={date}
                            className={`date-btn ${selectedDate === date ? 'active' : ''}`}
                            onClick={() => setSelectedDate(date)}
                        >
                            {date}
                        </button>
                    ))}
                </div>

                {/* theaters and times */}
                {filteredShowtimes.length > 0 ? (
                    <div className="theaters-list">
                        {filteredShowtimes.map(showtime => (
                            <div key={showtime._id} className="theater-card">
                                <div className="theater-info">
                                    <h3>{showtime.theater?.name}</h3>
                                    <p>{showtime.theater?.location}</p>
                                </div>
                                <div className="showtime-options">
                                    <button 
                                        className="time-btn"
                                        onClick={() => handleShowtimeSelect(showtime._id)}
                                    >
                                        {showtime.showTime}
                                        <span className="price">₹{showtime.price?.regular}</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-showtimes">No showtimes available for this movie</p>
                )}
            </div>
        </div>
    );
};

export default MovieDetails;
