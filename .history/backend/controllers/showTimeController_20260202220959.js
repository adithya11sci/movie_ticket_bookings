const ShowTime = require('../models/ShowTime');
const Theater = require('../models/Theater');
const Booking = require('../models/Booking');

// @desc    Get all showtimes
// @route   GET /api/showtimes
const getAllShowTimes = async (req, res) => {
    try {
        const showtimes = await ShowTime.find({ isActive: true })
            .populate('movie', 'title posterUrl duration')
            .populate('theater', 'name location');
        
        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get showtimes' });
    }
};

// @desc    Get showtimes by movie id
// @route   GET /api/showtimes/movie/:movieId
const getShowTimesByMovie = async (req, res) => {
    try {
        const showtimes = await ShowTime.find({ 
            movie: req.params.movieId,
            isActive: true 
        })
        .populate('theater', 'name location city')
        .sort({ showDate: 1 });
        
        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching showtimes' });
    }
};

// @desc    Get single showtime with seat info
// @route   GET /api/showtimes/:id
const getShowTimeById = async (req, res) => {
    try {
        const showtime = await ShowTime.findById(req.params.id)
            .populate('movie')
            .populate('theater');
        
        if (!showtime) {
            return res.status(404).json({ message: 'Showtime not found' });
        }
        
        res.json(showtime);
    } catch (error) {
        res.status(500).json({ message: 'Error getting showtime' });
    }
};

// @desc    Create showtime (admin)
// @route   POST /api/showtimes
const createShowTime = async (req, res) => {
    try {
        // get theater to calculate available seats
        const theater = await Theater.findById(req.body.theater);
        
        if (!theater) {
            return res.status(404).json({ message: 'Theater not found' });
        }
        
        const showtime = await ShowTime.create({
            ...req.body,
            availableSeats: theater.totalSeats
        });
        
        res.status(201).json(showtime);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Failed to create showtime' });
    }
};

// @desc    Update showtime (admin)
// @route   PUT /api/showtimes/:id
const updateShowTime = async (req, res) => {
    try {
        const showtime = await ShowTime.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!showtime) {
            return res.status(404).json({ message: 'Showtime not found' });
        }
        
        res.json(showtime);
    } catch (error) {
        res.status(400).json({ message: 'Update failed' });
    }
};

// @desc    Delete showtime (admin)
// @route   DELETE /api/showtimes/:id
const deleteShowTime = async (req, res) => {
    try {
        await ShowTime.findByIdAndDelete(req.params.id);
        res.json({ message: 'Showtime deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed' });
    }
};

module.exports = {
    getAllShowTimes,
    getShowTimesByMovie,
    getShowTimeById,
    createShowTime,
    updateShowTime,
    deleteShowTime
};
