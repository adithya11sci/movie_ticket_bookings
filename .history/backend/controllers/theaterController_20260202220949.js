const Theater = require('../models/Theater');
const ShowTime = require('../models/ShowTime');
const Booking = require('../models/Booking');

// @desc    Get all theaters
// @route   GET /api/theaters
const getAllTheaters = async (req, res) => {
    try {
        const theaters = await Theater.find({ isActive: true });
        res.json(theaters);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get theaters' });
    }
};

// @desc    Get theater by id
// @route   GET /api/theaters/:id
const getTheaterById = async (req, res) => {
    try {
        const theater = await Theater.findById(req.params.id);
        
        if (!theater) {
            return res.status(404).json({ message: 'Theater not found' });
        }
        
        res.json(theater);
    } catch (error) {
        res.status(500).json({ message: 'Error getting theater' });
    }
};

// @desc    Create theater (admin)
// @route   POST /api/theaters
const createTheater = async (req, res) => {
    try {
        const theater = await Theater.create(req.body);
        res.status(201).json(theater);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create theater', error: error.message });
    }
};

// @desc    Update theater (admin)
// @route   PUT /api/theaters/:id
const updateTheater = async (req, res) => {
    try {
        const theater = await Theater.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!theater) {
            return res.status(404).json({ message: 'Theater not found' });
        }
        
        res.json(theater);
    } catch (error) {
        res.status(400).json({ message: 'Update failed' });
    }
};

// @desc    Delete theater (admin)
// @route   DELETE /api/theaters/:id
// @query   ?confirm=true to force delete with refunds
const deleteTheater = async (req, res) => {
    try {
        const { confirm } = req.query;
        const theaterId = req.params.id;
        
        // Find all showtimes for this theater
        const showtimes = await ShowTime.find({ theater: theaterId });
        const showtimeIds = showtimes.map(st => st._id);
        
        // Find all active bookings for these showtimes
        const activeBookings = await Booking.find({
            showTime: { $in: showtimeIds },
            bookingStatus: { $in: ['confirmed', 'pending'] }
        }).populate('user', 'name email');
        
        // If there are active bookings and no confirmation
        if (activeBookings.length > 0 && confirm !== 'true') {
            const totalRefundAmount = activeBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
            const totalTickets = activeBookings.reduce((sum, b) => sum + (b.totalSeats || 0), 0);
            
            return res.status(400).json({
                message: 'Theater has active bookings',
                requiresConfirmation: true,
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
                booking.cancellationReason = 'Theater deleted by admin';
                await booking.save();
            }
        }
        
        // Delete all showtimes for this theater
        await ShowTime.deleteMany({ theater: theaterId });
        
        // Delete the theater
        await Theater.findByIdAndDelete(theaterId);
        
        res.json({ 
            message: 'Theater deleted successfully',
            refundedBookings: activeBookings.length,
            totalRefundAmount: activeBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
        });
    } catch (error) {
        console.log('Delete theater error:', error);
        res.status(500).json({ message: 'Delete failed' });
    }
};

// @desc    Check theater deletion impact (admin)
// @route   GET /api/theaters/:id/deletion-impact
const getTheaterDeletionImpact = async (req, res) => {
    try {
        const theaterId = req.params.id;
        
        // Find theater
        const theater = await Theater.findById(theaterId);
        if (!theater) {
            return res.status(404).json({ message: 'Theater not found' });
        }
        
        // Find all showtimes for this theater
        const showtimes = await ShowTime.find({ theater: theaterId })
            .populate('movie', 'title');
        const showtimeIds = showtimes.map(st => st._id);
        
        // Find all active bookings
        const activeBookings = await Booking.find({
            showTime: { $in: showtimeIds },
            bookingStatus: { $in: ['confirmed', 'pending'] }
        }).populate('user', 'name email');
        
        const totalRefundAmount = activeBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
        const totalTickets = activeBookings.reduce((sum, b) => sum + (b.totalSeats || 0), 0);
        
        res.json({
            theater: {
                name: theater.name,
                location: theater.location
            },
            impact: {
                totalShowtimes: showtimes.length,
                totalBookings: activeBookings.length,
                totalTickets: totalTickets,
                totalRefundAmount: totalRefundAmount,
                affectedMovies: [...new Set(showtimes.map(st => st.movie?.title).filter(Boolean))],
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
    getAllTheaters,
    getTheaterById,
    createTheater,
    updateTheater,
    deleteTheater
};
