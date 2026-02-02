const Booking = require('../models/Booking');
const ShowTime = require('../models/ShowTime');

// @desc    Create new booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
    try {
        const { showTimeId, seats, totalAmount } = req.body;
        
        // find the showtime
        const showtime = await ShowTime.findById(showTimeId);
        
        if (!showtime) {
            return res.status(404).json({ message: 'Showtime not found' });
        }
        
        // check if seats are already booked
        const seatNumbers = seats.map(s => s.seatNumber);
        const alreadyBooked = seatNumbers.some(seat => 
            showtime.bookedSeats.includes(seat)
        );
        
        if (alreadyBooked) {
            return res.status(400).json({ message: 'Some seats are already booked' });
        }
        
        // create booking
        const booking = await Booking.create({
            user: req.user._id,
            showTime: showTimeId,
            seats: seats,
            totalSeats: seats.length,
            totalAmount: totalAmount
        });
        
        // update showtime - add booked seats
        showtime.bookedSeats.push(...seatNumbers);
        showtime.availableSeats -= seats.length;
        await showtime.save();
        
        res.status(201).json({
            message: 'Booking created successfully',
            booking
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Booking failed' });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate({
                path: 'showTime',
                populate: [
                    { path: 'movie', select: 'title posterUrl' },
                    { path: 'theater', select: 'name location' }
                ]
            })
            .sort({ bookingDate: -1 });
        
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get bookings' });
    }
};

// @desc    Get booking by id
// @route   GET /api/bookings/:id
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate({
                path: 'showTime',
                populate: [
                    { path: 'movie' },
                    { path: 'theater' }
                ]
            });
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        // check if user owns this booking or is admin
        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error getting booking' });
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        // check ownership
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        // update booking status
        booking.bookingStatus = 'cancelled';
        await booking.save();
        
        // free up the seats in showtime
        const showtime = await ShowTime.findById(booking.showTime);
        const seatNumbers = booking.seats.map(s => s.seatNumber);
        
        showtime.bookedSeats = showtime.bookedSeats.filter(
            seat => !seatNumbers.includes(seat)
        );
        showtime.availableSeats += booking.totalSeats;
        await showtime.save();
        
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Cancel failed' });
    }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate({
                path: 'showTime',
                populate: [
                    { path: 'movie', select: 'title' },
                    { path: 'theater', select: 'name' }
                ]
            })
            .sort({ bookingDate: -1 });
        
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get bookings' });
    }
};

// @desc    Update payment status
// @route   PUT /api/bookings/:id/payment
const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus, paymentId } = req.body;
        
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        booking.paymentStatus = paymentStatus;
        booking.paymentId = paymentId;
        
        if (paymentStatus === 'completed') {
            booking.bookingStatus = 'confirmed';
        }
        
        await booking.save();
        
        res.json({ message: 'Payment updated', booking });
    } catch (error) {
        res.status(500).json({ message: 'Payment update failed' });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    getAllBookings,
    updatePaymentStatus
};
