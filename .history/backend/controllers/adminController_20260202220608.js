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
            .populate('theater')
            .populate('movie', 'title');
        
        if (!showtime) {
            return res.status(404).json({ message: 'Showtime not found' });
        }
        
        const totalSeats = showtime.theater.totalSeats;
        const bookedSeats = showtime.bookedSeats.length;
        const availableSeats = showtime.availableSeats;
        
        res.json({
            showtime: {
                movie: showtime.movie.title,
                theater: showtime.theater.name,
                date: showtime.showDate,
                time: showtime.showTime
            },
            totalSeats,
            bookedSeats,
            availableSeats,
            bookedSeatNumbers: showtime.bookedSeats,
            occupancyRate: ((bookedSeats / totalSeats) * 100).toFixed(1)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error getting seat info' });
    }
};

// @desc    Get all showtimes with seat availability
// @route   GET /api/admin/showtimes/availability
const getAllShowtimesAvailability = async (req, res) => {
    try {
        const showtimes = await ShowTime.find()
            .populate('movie', 'title posterUrl')
            .populate('theater', 'name location totalSeats')
            .sort({ showDate: 1, showTime: 1 });
        
        const availability = showtimes.map(st => ({
            _id: st._id,
            movieTitle: st.movie?.title,
            moviePoster: st.movie?.posterUrl,
            theaterName: st.theater?.name,
            location: st.theater?.location,
            date: st.showDate,
            time: st.showTime,
            totalSeats: st.theater?.totalSeats || 0,
            bookedSeats: st.bookedSeats?.length || 0,
            availableSeats: st.availableSeats || 0,
            occupancyRate: st.theater?.totalSeats 
                ? (((st.bookedSeats?.length || 0) / st.theater.totalSeats) * 100)
                : 0,
            price: st.price
        }));
        
        res.json({ showtimes: availability });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to get availability' });
    }
};

// @desc    Get all bookings with filters (admin)
// @route   GET /api/admin/bookings
const getAllBookings = async (req, res) => {
    try {
        const { status, startDate, endDate, movie } = req.query;
        
        let query = {};
        
        if (status) {
            query.bookingStatus = status;
        }
        
        if (startDate && endDate) {
            query.bookingDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        const bookings = await Booking.find(query)
            .populate('user', 'name email phone')
            .populate({
                path: 'showTime',
                populate: [
                    { path: 'movie', select: 'title posterUrl genre' },
                    { path: 'theater', select: 'name location city' }
                ]
            })
            .sort({ bookingDate: -1 })
            .lean(); // Use lean() for better performance
        
        // Filter out bookings with null showTime and format the data
        const validBookings = bookings.map(b => ({
            ...b,
            showTime: b.showTime || { movie: { title: 'Deleted' }, theater: { name: 'N/A' } }
        }));
        
        // Calculate summary
        const summary = {
            totalBookings: validBookings.length,
            confirmedBookings: validBookings.filter(b => b.bookingStatus === 'confirmed').length,
            cancelledBookings: validBookings.filter(b => b.bookingStatus === 'cancelled').length,
            pendingBookings: validBookings.filter(b => b.bookingStatus === 'pending').length,
            totalRevenue: validBookings
                .filter(b => b.paymentStatus === 'completed')
                .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
            totalSeatsBooked: validBookings
                .filter(b => b.bookingStatus === 'confirmed')
                .reduce((sum, b) => sum + (b.totalSeats || 0), 0)
        };
        
        res.json({ bookings: validBookings, summary });
    } catch (error) {
        console.log('getAllBookings error:', error);
        res.status(500).json({ message: 'Failed to get bookings' });
    }
};

// @desc    Update user role (admin)
// @route   PUT /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user role' });
    }
};

// @desc    Delete a user (admin)
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Don't allow deleting yourself
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete yourself' });
        }
        
        await User.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user' });
    }
};

// @desc    Cancel a booking (admin)
// @route   PUT /api/admin/bookings/:id/cancel
const adminCancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('showTime');
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        if (booking.bookingStatus === 'cancelled') {
            return res.status(400).json({ message: 'Booking already cancelled' });
        }
        
        // Release the seats back
        const showtime = await ShowTime.findById(booking.showTime._id);
        const seatNumbers = booking.seats.map(s => s.seatNumber);
        
        showtime.bookedSeats = showtime.bookedSeats.filter(
            seat => !seatNumbers.includes(seat)
        );
        showtime.availableSeats += seatNumbers.length;
        await showtime.save();
        
        // Update booking status
        booking.bookingStatus = 'cancelled';
        booking.cancelledAt = new Date();
        booking.cancelledBy = 'admin';
        await booking.save();
        
        res.json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to cancel booking' });
    }
};

// @desc    Get activity log
// @route   GET /api/admin/activity
const getActivityLog = async (req, res) => {
    try {
        // Get recent activities from bookings
        const recentBookings = await Booking.find()
            .populate('user', 'name')
            .populate({
                path: 'showTime',
                populate: { path: 'movie', select: 'title' }
            })
            .sort({ createdAt: -1 })
            .limit(20);
        
        const activities = recentBookings.map(b => ({
            type: b.bookingStatus === 'cancelled' ? 'cancellation' : 'booking',
            user: b.user?.name || 'Unknown',
            movie: b.showTime?.movie?.title || 'Unknown',
            seats: b.totalSeats,
            amount: b.totalAmount,
            status: b.bookingStatus,
            date: b.bookingDate
        }));
        
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get activity log' });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    getSeatAvailability,
    getAllShowtimesAvailability,
    getAllBookings,
    updateUserRole,
    deleteUser,
    adminCancelBooking,
    getActivityLog
};
