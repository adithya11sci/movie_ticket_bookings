const User = require('../models/User');
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');
const Theater = require('../models/Theater');
const ShowTime = require('../models/ShowTime');

// @desc    Get comprehensive dashboard stats for admin
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res) => {
    try {
        // Get basic counts
        const totalUsers = await User.countDocuments();
        const totalMovies = await Movie.countDocuments();
        const totalTheaters = await Theater.countDocuments();
        const totalBookings = await Booking.countDocuments();
        
        // Get active movies (currently showing)
        const activeMovies = await Movie.countDocuments({ isActive: { $ne: false } });
        
        // Get revenue - sum of all completed bookings
        const revenueData = await Booking.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
        
        // Get today's revenue
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayRevenueData = await Booking.aggregate([
            { 
                $match: { 
                    paymentStatus: 'completed',
                    bookingDate: { $gte: today }
                } 
            },
            { $group: { _id: null, todayRevenue: { $sum: '$totalAmount' } } }
        ]);
        const todayRevenue = todayRevenueData.length > 0 ? todayRevenueData[0].todayRevenue : 0;
        
        // Get total seats across all theaters
        const theaterSeats = await Theater.aggregate([
            { $group: { _id: null, totalSeats: { $sum: '$totalSeats' } } }
        ]);
        const totalSeatsCapacity = theaterSeats.length > 0 ? theaterSeats[0].totalSeats : 0;
        
        // Get total booked seats (from confirmed bookings)
        const bookedSeatsData = await Booking.aggregate([
            { $match: { bookingStatus: 'confirmed' } },
            { $group: { _id: null, totalBookedSeats: { $sum: '$totalSeats' } } }
        ]);
        const totalBookedSeats = bookedSeatsData.length > 0 ? bookedSeatsData[0].totalBookedSeats : 0;
        
        // Get recent bookings with full details
        const recentBookings = await Booking.find()
            .populate('user', 'name email')
            .populate({
                path: 'showTime',
                populate: [
                    { path: 'movie', select: 'title posterUrl' },
                    { path: 'theater', select: 'name location' }
                ]
            })
            .sort({ bookingDate: -1 })
            .limit(10);
        
        // Get booking stats by status
        const bookingStats = await Booking.aggregate([
            { $group: { _id: '$bookingStatus', count: { $sum: 1 } } }
        ]);
        
        // Get bookings by date (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const dailyBookings = await Booking.aggregate([
            { $match: { bookingDate: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$bookingDate' } },
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Get top movies by bookings
        const topMovies = await Booking.aggregate([
            { $match: { bookingStatus: 'confirmed' } },
            {
                $lookup: {
                    from: 'showtimes',
                    localField: 'showTime',
                    foreignField: '_id',
                    as: 'showTimeData'
                }
            },
            { $unwind: '$showTimeData' },
            {
                $lookup: {
                    from: 'movies',
                    localField: 'showTimeData.movie',
                    foreignField: '_id',
                    as: 'movieData'
                }
            },
            { $unwind: '$movieData' },
            {
                $group: {
                    _id: '$movieData._id',
                    title: { $first: '$movieData.title' },
                    posterUrl: { $first: '$movieData.posterUrl' },
                    bookings: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' },
                    seats: { $sum: '$totalSeats' }
                }
            },
            { $sort: { bookings: -1 } },
            { $limit: 5 }
        ]);
        
        res.json({
            stats: {
                totalUsers,
                totalMovies,
                activeMovies,
                totalTheaters,
                totalBookings,
                totalRevenue,
                todayRevenue,
                totalSeatsCapacity,
                totalBookedSeats
            },
            recentBookings,
            bookingStats,
            dailyBookings,
            topMovies
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
