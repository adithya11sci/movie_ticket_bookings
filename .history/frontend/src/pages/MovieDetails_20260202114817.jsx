import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { FaClock, FaHeart, FaRegHeart, FaInfoCircle, FaSearch, FaChevronDown, FaStar, FaPlay, FaShareAlt } from 'react-icons/fa';
import './MovieDetails.css';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [showBooking, setShowBooking] = useState(false);

    // Generate next 7 days
    const getNextDays = () => {
        const days = [];
        const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            days.push({
                day: dayNames[date.getDay()],
                date: date.getDate(),
                month: monthNames[date.getMonth()],
                fullDate: date.toISOString().split('T')[0],
                isToday: i === 0
            });
        }
        return days;
    };

    const [dates] = useState(getNextDays());

    useEffect(() => {
        fetchMovieDetails();
        // Set default date to today
        setSelectedDate(dates[0].fullDate);
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

    // Group showtimes by theater
    const getGroupedShowtimes = () => {
        if (!selectedDate) return {};
        
        const filtered = showtimes.filter(st => {
            const showDate = new Date(st.showDate).toISOString().split('T')[0];
            return showDate === selectedDate;
        });

        // Group by theater
        const grouped = {};
        filtered.forEach(st => {
            const theaterId = st.theater?._id;
            if (!grouped[theaterId]) {
                grouped[theaterId] = {
                    theater: st.theater,
                    times: []
                };
            }
            grouped[theaterId].times.push(st);
        });

        // Sort times within each theater
        Object.values(grouped).forEach(group => {
            group.times.sort((a, b) => {
                const timeA = a.showTime.replace(':', '');
                const timeB = b.showTime.replace(':', '');
                return timeA.localeCompare(timeB);
            });
        });

        return grouped;
    };

    const toggleFavorite = (theaterId) => {
        setFavorites(prev => 
            prev.includes(theaterId) 
                ? prev.filter(id => id !== theaterId)
                : [...prev, theaterId]
        );
    };

    const handleShowtimeSelect = (showtimeId) => {
        navigate(`/booking/${showtimeId}`);
    };

    const groupedShowtimes = getGroupedShowtimes();

    if (loading) {
        return <div className="loading-page">Loading...</div>;
    }

    if (!movie) {
        return <div className="error-page">Movie not found</div>;
    }

    return (
        <div className="movie-details-page">
            {/* Hero Banner Section - Like BookMyShow */}
            <div className="movie-hero-banner" style={{
                backgroundImage: `linear-gradient(90deg, rgba(26, 26, 46, 0.95) 0%, rgba(26, 26, 46, 0.7) 50%, transparent 100%), url(${movie.posterUrl})`
            }}>
                <div className="hero-banner-content">
                    {/* Movie Poster */}
                    <div className="hero-poster-container">
                        <img src={movie.posterUrl} alt={movie.title} className="hero-poster" />
                        <div className="trailer-btn">
                            <FaPlay /> Trailer
                        </div>
                        <span className="in-cinemas-badge">In cinemas</span>
                    </div>

                    {/* Movie Info */}
                    <div className="hero-movie-info">
                        <h1 className="hero-title">{movie.title}</h1>
                        
                        {/* Rating Box */}
                        <div className="rating-box">
                            <div className="rating-score">
                                <FaStar className="star-icon" />
                                <span className="score">{movie.rating}/10</span>
                                <span className="votes">({Math.floor(Math.random() * 10) + 1}K+ Votes)</span>
                            </div>
                            <button className="rate-now-btn">Rate now</button>
                        </div>

                        {/* Movie Meta */}
                        <div className="hero-meta">
                            <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
                            <span className="dot">•</span>
                            <span>{movie.genre?.join(', ')}</span>
                            <span className="dot">•</span>
                            <span>{movie.rating >= 7 ? 'UA16+' : 'A'}</span>
                            <span className="dot">•</span>
                            <span>{new Date(movie.releaseDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>

                        {/* Format Tags */}
                        <div className="format-tags">
                            <span className="format-tag">2D</span>
                            <span className="format-tag">{movie.language || 'English'}</span>
                        </div>

                        {/* Book Tickets Button - Scrolls to booking section */}
                        <button className="book-tickets-btn" onClick={() => document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' })}>
                            Book tickets
                        </button>
                    </div>

                    {/* Share Button */}
                    <button className="share-btn">
                        <FaShareAlt /> Share
                    </button>
                </div>
            </div>

            {/* Booking Section - Movie Header + Date Selector + Theaters */}
            <div id="booking-section">
                {/* Movie Header - Compact */}
                <div className="movie-header">
                    <div className="movie-header-content">
                            <h1 className="movie-title-main">
                                {movie.title} - ({movie.language || 'English'})
                            </h1>
                            <div className="movie-tags">
                                <span className="tag runtime">
                                    <FaClock /> {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                                </span>
                                <span className="tag rating-badge">{movie.rating >= 7 ? 'UA13+' : 'A'}</span>
                                {movie.genre?.map((g, i) => (
                                    <span key={i} className="tag genre">{g}</span>
                                ))}
                            </div>
                        </div>
                    </div>

            {/* Date Selector - Week View */}
            <div className="date-filter-section">
                <div className="date-filter-content">
                    <div className="date-tabs">
                        {dates.map((d, idx) => (
                            <button
                                key={idx}
                                className={`date-tab ${selectedDate === d.fullDate ? 'active' : ''}`}
                                onClick={() => setSelectedDate(d.fullDate)}
                            >
                                <span className="day-name">{d.day}</span>
                                <span className="day-date">{d.date.toString().padStart(2, '0')}</span>
                                <span className="day-month">{d.month}</span>
                            </button>
                        ))}
                    </div>

                    {/* Filter Options */}
                    <div className="filter-options">
                        <div className="filter-dropdown">
                            <span>{movie.language || 'Hindi'} - 2D</span>
                            <FaChevronDown />
                        </div>
                        <div className="filter-dropdown">
                            <span>Price Range</span>
                            <FaChevronDown />
                        </div>
                        <div className="filter-dropdown">
                            <span>Preferred Time</span>
                            <FaChevronDown />
                        </div>
                        <div className="filter-dropdown">
                            <span>Sort By</span>
                            <FaChevronDown />
                        </div>
                        <button className="search-theaters-btn">
                            <FaSearch />
                        </button>
                    </div>
                </div>

                {/* Legend */}
                <div className="legend-bar">
                    <div className="subtitle-info">
                        <span className="lan-badge">LAN</span>
                        indicates subtitle language, if subtitles are available <span className="got-it">Got it</span>
                    </div>
                    <div className="availability-legend">
                        <span className="legend-item available">
                            <span className="dot"></span> AVAILABLE
                        </span>
                        <span className="legend-item fast-filling">
                            <span className="dot"></span> FAST FILLING
                        </span>
                    </div>
                </div>
            </div>

            {/* Theaters List - BookMyShow Style */}
            <div className="theaters-section">
                {Object.keys(groupedShowtimes).length > 0 ? (
                    Object.values(groupedShowtimes).map(({ theater, times }) => (
                        <div key={theater._id} className="theater-row">
                            <div className="theater-details">
                                <div className="theater-name-section">
                                    <button 
                                        className="favorite-btn"
                                        onClick={() => toggleFavorite(theater._id)}
                                    >
                                        {favorites.includes(theater._id) 
                                            ? <FaHeart className="filled" />
                                            : <FaRegHeart />
                                        }
                                    </button>
                                    <div className="theater-name-info">
                                        <h3>{theater.name}</h3>
                                        <p className="theater-location">
                                            {theater.location}
                                            <FaInfoCircle className="info-icon" />
                                        </p>
                                    </div>
                                </div>
                                <div className="theater-amenities">
                                    <span className="amenity mticket" title="M-Ticket">🎫</span>
                                    <span className="amenity food" title="Food & Beverages">🍿</span>
                                </div>
                            </div>

                            <div className="showtimes-grid">
                                {times.map((showtime) => {
                                    const availableSeats = (showtime.theater?.totalSeats || 100) - (showtime.bookedSeats?.length || 0);
                                    const isFastFilling = availableSeats < 50;
                                    const isAlmostFull = availableSeats < 20;
                                    
                                    return (
                                        <button
                                            key={showtime._id}
                                            className={`showtime-btn ${isFastFilling ? 'fast-filling' : ''} ${isAlmostFull ? 'almost-full' : ''}`}
                                            onClick={() => handleShowtimeSelect(showtime._id)}
                                        >
                                            <span className="time">{showtime.showTime}</span>
                                            {showtime.screenType && showtime.screenType !== '2D' && (
                                                <span className="screen-type">{showtime.screenType}</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="theater-footer">
                                <span className="cancellation-info">Cancellation available</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-showtimes">
                        <p>No showtimes available for this date. Please select another date.</p>
                    </div>
                )}
            </div>
                </>
            )}
        </div>
    );
};

export default MovieDetails;
