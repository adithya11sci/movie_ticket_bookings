/**
 * SeatMonitor.jsx
 * Real-time seat availability monitoring for admin
 * Shows all showtimes with their seat occupancy status
 */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    FaChair,
    FaFilm,
    FaCalendarAlt,
    FaClock,
    FaSync,
    FaArrowLeft,
    FaExclamationTriangle,
    FaCheckCircle,
    FaTheaterMasks,
    FaSearch,
    FaFilter
} from 'react-icons/fa';
import API from '../../api/axios';
import './SeatMonitor.css';

const SeatMonitor = () => {
    // State management
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, available, filling, soldout

    /**
     * Fetch all showtimes with seat availability
     */
    const fetchSeatAvailability = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            }
            
            const response = await API.get('/admin/showtimes/availability');
            setShowtimes(response.data.showtimes || []);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            console.error('Error fetching seat availability:', err);
            setError('Failed to load seat availability data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Initial load and auto-refresh every 30 seconds
    useEffect(() => {
        fetchSeatAvailability();
        
        const interval = setInterval(() => {
            fetchSeatAvailability(true);
        }, 30000);
        
        return () => clearInterval(interval);
    }, [fetchSeatAvailability]);

    /**
     * Get status badge based on occupancy rate
     * @param {number} occupancy - Occupancy percentage
     * @returns {object} Status object with class and label
     */
    const getOccupancyStatus = (occupancy) => {
        if (occupancy >= 90) {
            return { class: 'soldout', label: 'Almost Sold Out', icon: FaExclamationTriangle };
        } else if (occupancy >= 70) {
            return { class: 'filling', label: 'Filling Fast', icon: FaExclamationTriangle };
        } else if (occupancy >= 30) {
            return { class: 'available', label: 'Available', icon: FaCheckCircle };
        } else {
            return { class: 'open', label: 'Plenty Available', icon: FaCheckCircle };
        }
    };

    /**
     * Format date for display
     */
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    /**
     * Format time for display
     */
    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    /**
     * Filter showtimes based on search and status
     */
    const filteredShowtimes = showtimes.filter(showtime => {
        // Search filter
        const matchesSearch = 
            showtime.movieTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            showtime.theaterName?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Status filter
        const occupancy = showtime.occupancyRate || 0;
        let matchesStatus = true;
        
        if (filterStatus === 'available') {
            matchesStatus = occupancy < 70;
        } else if (filterStatus === 'filling') {
            matchesStatus = occupancy >= 70 && occupancy < 90;
        } else if (filterStatus === 'soldout') {
            matchesStatus = occupancy >= 90;
        }
        
        return matchesSearch && matchesStatus;
    });

    // Loading state
    if (loading) {
        return (
            <div className="seat-monitor-loading">
                <div className="loading-spinner"></div>
                <p>Loading seat availability...</p>
            </div>
        );
    }

    return (
        <div className="seat-monitor-container">
            {/* Header */}
            <div className="monitor-header">
                <div className="header-left">
                    <Link to="/admin" className="back-link">
                        <FaArrowLeft />
                        Back to Dashboard
                    </Link>
                    <h1>
                        <FaChair />
                        Real-Time Seat Monitor
                    </h1>
                    <p className="last-updated">
                        {refreshing ? (
                            <>
                                <FaSync className="spin" /> Refreshing...
                            </>
                        ) : lastUpdated ? (
                            <>Last updated: {lastUpdated.toLocaleTimeString()}</>
                        ) : null}
                    </p>
                </div>
                
                <button 
                    className="refresh-btn"
                    onClick={() => fetchSeatAvailability(true)}
                    disabled={refreshing}
                >
                    <FaSync className={refreshing ? 'spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Summary Stats */}
            <div className="summary-stats">
                <div className="summary-card total">
                    <FaCalendarAlt />
                    <div>
                        <h3>{showtimes.length}</h3>
                        <p>Active Showtimes</p>
                    </div>
                </div>
                <div className="summary-card available">
                    <FaCheckCircle />
                    <div>
                        <h3>{showtimes.filter(s => (s.occupancyRate || 0) < 70).length}</h3>
                        <p>Available</p>
                    </div>
                </div>
                <div className="summary-card filling">
                    <FaExclamationTriangle />
                    <div>
                        <h3>{showtimes.filter(s => (s.occupancyRate || 0) >= 70 && (s.occupancyRate || 0) < 90).length}</h3>
                        <p>Filling Fast</p>
                    </div>
                </div>
                <div className="summary-card soldout">
                    <FaExclamationTriangle />
                    <div>
                        <h3>{showtimes.filter(s => (s.occupancyRate || 0) >= 90).length}</h3>
                        <p>Almost Sold Out</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search by movie or theater..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="filter-dropdown">
                    <FaFilter />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Showtimes</option>
                        <option value="available">Available (&lt; 70%)</option>
                        <option value="filling">Filling Fast (70-90%)</option>
                        <option value="soldout">Almost Sold Out (&gt; 90%)</option>
                    </select>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="error-message">
                    <FaExclamationTriangle />
                    {error}
                </div>
            )}

            {/* Showtimes Grid */}
            <div className="showtimes-grid">
                {filteredShowtimes.length === 0 ? (
                    <div className="no-results">
                        <FaFilm />
                        <p>No showtimes found matching your criteria</p>
                    </div>
                ) : (
                    filteredShowtimes.map(showtime => {
                        const status = getOccupancyStatus(showtime.occupancyRate || 0);
                        const StatusIcon = status.icon;
                        
                        return (
                            <div key={showtime._id} className={`showtime-card ${status.class}`}>
                                {/* Movie Poster */}
                                <div className="showtime-poster">
                                    {showtime.moviePoster ? (
                                        <img src={showtime.moviePoster} alt={showtime.movieTitle} />
                                    ) : (
                                        <div className="no-poster">
                                            <FaFilm />
                                        </div>
                                    )}
                                    <span className={`status-badge ${status.class}`}>
                                        <StatusIcon />
                                        {status.label}
                                    </span>
                                </div>
                                
                                {/* Showtime Details */}
                                <div className="showtime-details">
                                    <h3 className="movie-title">{showtime.movieTitle}</h3>
                                    
                                    <div className="detail-row">
                                        <FaTheaterMasks />
                                        <span>{showtime.theaterName}</span>
                                    </div>
                                    
                                    <div className="detail-row">
                                        <FaCalendarAlt />
                                        <span>{formatDate(showtime.date)}</span>
                                    </div>
                                    
                                    <div className="detail-row">
                                        <FaClock />
                                        <span>{formatTime(showtime.time)}</span>
                                    </div>
                                    
                                    {/* Seat Availability Bar */}
                                    <div className="seat-availability">
                                        <div className="availability-header">
                                            <span>Seats</span>
                                            <span>
                                                {showtime.bookedSeats || 0} / {showtime.totalSeats || 0}
                                            </span>
                                        </div>
                                        <div className="availability-bar">
                                            <div 
                                                className={`filled ${status.class}`}
                                                style={{ width: `${showtime.occupancyRate || 0}%` }}
                                            ></div>
                                        </div>
                                        <div className="availability-footer">
                                            <span className="available-count">
                                                {showtime.availableSeats || showtime.totalSeats || 0} available
                                            </span>
                                            <span className="occupancy-rate">
                                                {(showtime.occupancyRate || 0).toFixed(1)}% booked
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default SeatMonitor;
