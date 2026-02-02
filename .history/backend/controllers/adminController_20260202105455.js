const User = require('../models/User');
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');
const Theater = require('../models/Theater');
const ShowTime = require('../models/ShowTime');

// @desc    Get dashboard stats for admin
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res) => {
    try {
        // get counts
        const totalUsers = await User.countDocuments();
        const totalMovies = await Movie.countDocuments();
        const totalTheaters = await Theater.countDocuments();
        const totalBookings = await Booking.countDocuments();
        
        // get revenue - sum of all completed bookings
        const revenueData = await Booking.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
        ]);
        
        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
        
        // get recent bookings
        const recentBookings = await Booking.find()
            .populate('user', 'name email')
            .populate({
                path: 'showTime',
                populate: { path: 'movie', select: 'title' }
            })
            .sort({ bookingDate: -1 })
            .limit(10);
        
        // get booking stats by status
        const bookingStats = await Booking.aggregate([
            { $group: { _id: '$bookingStatus', count: { $sum: 1 } } }
        ]);
        
        res.json({
            stats: {
                totalUsers,
                totalMovies,
                totalTheaters,
                totalBookings,
                totalRevenue
            },
            recentBookings,
            bookingStats
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to get stats' });
    }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get users' });
    }
};

// @desc    Get seat availability for a showtime
// @route   GET /api/admin/seats/:showTimeId
const getSeatAvailability = async (req, res) => {
    try {
        const showtime = await ShowTime.findById(req.params.showTimeId)
            .populate('theater');
        
        if (!showtime) {
            return res.status(404).json({ message: 'Showtime not found' });
        }
        
        const totalSeats = showtime.theater.totalSeats;
        const bookedSeats = showtime.bookedSeats.length;
        const availableSeats = showtime.availableSeats;
        
        res.json({
            totalSeats,
            bookedSeats,
            availableSeats,
            bookedSeatNumbers: showtime.bookedSeats
        });
    } catch (error) {
        res.status(500).json({ message: 'Error getting seat info' });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    getSeatAvailability
};
