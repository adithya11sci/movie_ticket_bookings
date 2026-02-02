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
        .populate('movie', 'title posterUrl duration language')
        .populate('theater', 'name location city')
        .sort({ showDate: 1 });
        
        // Filter out showtimes with deleted theaters or movies
        const validShowtimes = showtimes.filter(st => st.movie && st.theater);
        
        res.json(validShowtimes);
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
// @query   ?confirm=true to force delete with refunds
const deleteShowTime = async (req, res) => {
    try {
        const { confirm } = req.query;
        const showtimeId = req.params.id;
        
        // Find the showtime
        const showtime = await ShowTime.findById(showtimeId)
            .populate('movie', 'title')
            .populate('theater', 'name');
        
        if (!showtime) {
            return res.status(404).json({ message: 'Showtime not found' });
        }
        
        // Find all active bookings for this showtime
        const activeBookings = await Booking.find({
            showTime: showtimeId,
            bookingStatus: { $in: ['confirmed', 'pending'] }
        }).populate('user', 'name email');
        
        // If there are active bookings and no confirmation
        if (activeBookings.length > 0 && confirm !== 'true') {
            const totalRefundAmount = activeBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
            const totalTickets = activeBookings.reduce((sum, b) => sum + (b.totalSeats || 0), 0);
            
            return res.status(400).json({
                message: 'Showtime has active bookings',
                requiresConfirmation: true,
                showtimeDetails: {
                    movie: showtime.movie?.title,
                    theater: showtime.theater?.name,
                    date: showtime.showDate,
                    time: showtime.showTime
                },
                bookingDetails: {
                    totalBookings: activeBookings.length,
                    totalTickets: totalTickets,
                    totalRefundAmount: totalRefundAmount,
                    affectedUsers: activeBookings.map(b => ({
                        name: b.user?.name || 'Unknown',
                        email: b.user?.email || 'Unknown',
                        tickets: b.totalSeats,
                        amount: b.totalAmount
                    }))
                }
            });
        }
        
        // If confirmed or no active bookings, proceed with deletion
        if (activeBookings.length > 0) {
            // Cancel all bookings and mark for refund
            for (const booking of activeBookings) {
                booking.bookingStatus = 'cancelled';
                booking.paymentStatus = 'refunded';
                booking.cancelledAt = new Date();
                booking.cancelledBy = 'admin';
                booking.cancellationReason = 'Showtime cancelled by admin';
                await booking.save();
            }
        }
        
        // Delete the showtime
        await ShowTime.findByIdAndDelete(showtimeId);
        
        res.json({ 
            message: 'Showtime deleted successfully',
            refundedBookings: activeBookings.length,
            totalRefundAmount: activeBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
        });
    } catch (error) {
        console.log('Delete showtime error:', error);
        res.status(500).json({ message: 'Delete failed' });
    }
};

// @desc    Check showtime deletion impact (admin)
// @route   GET /api/showtimes/:id/deletion-impact
const getShowtimeDeletionImpact = async (req, res) => {
    try {
        const showtimeId = req.params.id;
        
        // Find the showtime
        const showtime = await ShowTime.findById(showtimeId)
            .populate('movie', 'title posterUrl')
            .populate('theater', 'name location');
        
        if (!showtime) {
            return res.status(404).json({ message: 'Showtime not found' });
        }
        
        // Find all active bookings
        const activeBookings = await Booking.find({
            showTime: showtimeId,
            bookingStatus: { $in: ['confirmed', 'pending'] }
        }).populate('user', 'name email');
        
        const totalRefundAmount = activeBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
        const totalTickets = activeBookings.reduce((sum, b) => sum + (b.totalSeats || 0), 0);
        
        res.json({
            showtime: {
                movie: showtime.movie?.title,
                theater: showtime.theater?.name,
                date: showtime.showDate,
                time: showtime.showTime,
                price: showtime.price
            },
            impact: {
                totalBookings: activeBookings.length,
                totalTickets: totalTickets,
                totalRefundAmount: totalRefundAmount,
                affectedUsers: activeBookings.map(b => ({
                    name: b.user?.name || 'Unknown',
                    email: b.user?.email || 'Unknown',
                    tickets: b.totalSeats,
                    amount: b.totalAmount
                }))
            }
        });
    } catch (error) {
        console.log('Get deletion impact error:', error);
        res.status(500).json({ message: 'Failed to get deletion impact' });
    }
};

module.exports = {
    getAllShowTimes,
    getShowTimesByMovie,
    getShowTimeById,
    createShowTime,
    updateShowTime,
    deleteShowTime,
    getShowtimeDeletionImpact
};
