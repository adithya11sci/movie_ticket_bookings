const Booking = require('../models/Booking');
const ShowTime = require('../models/ShowTime');
const mongoose = require('mongoose');

// Lock duration in milliseconds (5 minutes)
const LOCK_DURATION = 5 * 60 * 1000;

// @desc    Lock seats for booking (ATOMIC OPERATION)
// @route   POST /api/bookings/lock-seats
const lockSeats = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { showTimeId, seatNumbers } = req.body;
        const userId = req.user._id;
        const lockExpiry = new Date(Date.now() + LOCK_DURATION);
        
        // ATOMIC: Find showtime and check all seats are available
        const showtime = await ShowTime.findById(showTimeId).session(session);
        
        if (!showtime) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Showtime not found' });
        }
        
        // Check each seat's status
        for (const seatNumber of seatNumbers) {
            const existingSeat = showtime.seatStatus.find(s => s.seatNumber === seatNumber);
            
            if (existingSeat) {
                // Check if seat is available or lock expired
                const isExpired = existingSeat.lockExpiry && new Date() > existingSeat.lockExpiry;
                const isOwnLock = existingSeat.lockedBy?.toString() === userId.toString();
                
                if (existingSeat.status === 'booked') {
                    await session.abortTransaction();
                    return res.status(409).json({ 
                        message: `Seat ${seatNumber} is already booked`,
                        conflictSeat: seatNumber
                    });
                }
                
                if (existingSeat.status === 'locked' && !isExpired && !isOwnLock) {
                    await session.abortTransaction();
                    return res.status(409).json({ 
                        message: `Seat ${seatNumber} is temporarily locked by another user`,
                        conflictSeat: seatNumber
                    });
                }
            }
            
            // Also check legacy bookedSeats array
            if (showtime.bookedSeats.includes(seatNumber)) {
                await session.abortTransaction();
                return res.status(409).json({ 
                    message: `Seat ${seatNumber} is already booked`,
                    conflictSeat: seatNumber
                });
            }
        }
        
        // ATOMIC: Lock all seats using findOneAndUpdate
        for (const seatNumber of seatNumbers) {
            await ShowTime.findOneAndUpdate(
                { 
                    _id: showTimeId,
                    $or: [
                        { 'seatStatus.seatNumber': { $ne: seatNumber } },
                        { 'seatStatus': { $elemMatch: { 
                            seatNumber, 
                            $or: [
                                { status: 'available' },
                                { lockExpiry: { $lt: new Date() } },
                                { lockedBy: userId }
                            ]
                        }}}
                    ]
                },
                {
                    $pull: { seatStatus: { seatNumber } }
                },
                { session }
            );
            
            await ShowTime.findOneAndUpdate(
                { _id: showTimeId },
                {
                    $push: {
                        seatStatus: {
                            seatNumber,
                            status: 'locked',
                            lockedBy: userId,
                            lockExpiry
                        }
                    }
                },
                { session }
            );
        }
        
        await session.commitTransaction();
        
        res.json({ 
            message: 'Seats locked successfully',
            lockExpiry,
            lockedSeats: seatNumbers
        });
        
    } catch (error) {
        await session.abortTransaction();
        console.log('Lock seats error:', error);
        res.status(500).json({ message: 'Failed to lock seats' });
    } finally {
        session.endSession();
    }
};

// @desc    Create new booking (ATOMIC with seat verification)
// @route   POST /api/bookings
const createBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { showTimeId, seats, totalAmount } = req.body;
        const userId = req.user._id;
        const seatNumbers = seats.map(s => s.seatNumber);
        
        // ATOMIC: Verify and update seats in one operation
        const showtime = await ShowTime.findById(showTimeId).session(session);
        
        if (!showtime) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Showtime not found' });
        }
        
        // Verify all seats are either locked by this user or available
        for (const seatNumber of seatNumbers) {
            const seatInfo = showtime.seatStatus.find(s => s.seatNumber === seatNumber);
            
            // Check legacy bookedSeats
            if (showtime.bookedSeats.includes(seatNumber)) {
                await session.abortTransaction();
                return res.status(409).json({ 
                    message: `Seat ${seatNumber} was just booked by another user`,
                    conflictSeat: seatNumber
                });
            }
            
            if (seatInfo) {
                const isOwnLock = seatInfo.lockedBy?.toString() === userId.toString();
                const isExpired = seatInfo.lockExpiry && new Date() > seatInfo.lockExpiry;
                
                if (seatInfo.status === 'booked') {
                    await session.abortTransaction();
                    return res.status(409).json({ 
                        message: `Seat ${seatNumber} is already booked`,
                        conflictSeat: seatNumber
                    });
                }
                
                if (seatInfo.status === 'locked' && !isOwnLock && !isExpired) {
                    await session.abortTransaction();
                    return res.status(409).json({ 
                        message: `Seat ${seatNumber} is locked by another user`,
                        conflictSeat: seatNumber
                    });
                }
            }
        }
        
        // Create booking
        const booking = await Booking.create([{
            user: userId,
            showTime: showTimeId,
            seats: seats,
            totalSeats: seats.length,
            totalAmount: totalAmount
        }], { session });
        
        // ATOMIC: Update seat status to booked
        for (const seatNumber of seatNumbers) {
            await ShowTime.findOneAndUpdate(
                { _id: showTimeId },
                { $pull: { seatStatus: { seatNumber } } },
                { session }
            );
            
            await ShowTime.findOneAndUpdate(
                { _id: showTimeId },
                {
                    $push: {
                        seatStatus: {
                            seatNumber,
                            status: 'booked',
                            bookedBy: userId
                        }
                    },
                    $addToSet: { bookedSeats: seatNumber },
                    $inc: { availableSeats: -1 }
                },
                { session }
            );
        }
        
        await session.commitTransaction();
        
        res.status(201).json({
            message: 'Booking created successfully',
            booking: booking[0]
        });
        
    } catch (error) {
        await session.abortTransaction();
        console.log('Booking error:', error);
        res.status(500).json({ message: 'Booking failed' });
    } finally {
        session.endSession();
    }
};

// @desc    Release locked seats (unlock)
// @route   POST /api/bookings/release-seats
const releaseSeats = async (req, res) => {
    try {
        const { showTimeId, seatNumbers } = req.body;
        const userId = req.user._id;
        
        // Only release seats locked by this user
        for (const seatNumber of seatNumbers) {
            await ShowTime.findOneAndUpdate(
                { 
                    _id: showTimeId,
                    'seatStatus': { 
                        $elemMatch: { 
                            seatNumber, 
                            lockedBy: userId,
                            status: 'locked'
                        }
                    }
                },
                {
                    $pull: { seatStatus: { seatNumber, lockedBy: userId } }
                }
            );
        }
        
        res.json({ message: 'Seats released' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to release seats' });
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

// @desc    Get user's bookings for a specific showtime (for seat display)
// @route   GET /api/bookings/showtime/:showTimeId/my-seats
const getMySeatsForShowtime = async (req, res) => {
    try {
        const { showTimeId } = req.params;
        const userId = req.user._id;
        
        // Find user's bookings for this showtime
        const bookings = await Booking.find({
            user: userId,
            showTime: showTimeId,
            bookingStatus: { $ne: 'cancelled' }
        });
        
        // Extract all seat numbers
        const mySeats = [];
        bookings.forEach(booking => {
            booking.seats.forEach(seat => {
                mySeats.push(seat.seatNumber);
            });
        });
        
        res.json({ mySeats });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get user seats' });
    }
};

// @desc    Get seat status for a showtime (all locked/booked seats)
// @route   GET /api/bookings/showtime/:showTimeId/seat-status
const getSeatStatus = async (req, res) => {
    try {
        const { showTimeId } = req.params;
        
        const showtime = await ShowTime.findById(showTimeId);
        
        if (!showtime) {
            return res.status(404).json({ message: 'Showtime not found' });
        }
        
        // Clean up expired locks first
        const now = new Date();
        showtime.seatStatus = showtime.seatStatus.filter(seat => {
            if (seat.status === 'locked' && seat.lockExpiry && seat.lockExpiry < now) {
                return false; // Remove expired locks
            }
            return true;
        });
        await showtime.save();
        
        res.json({
            bookedSeats: showtime.bookedSeats,
            seatStatus: showtime.seatStatus
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get seat status' });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    getAllBookings,
    updatePaymentStatus,
    lockSeats,
    releaseSeats,
    getMySeatsForShowtime,
    getSeatStatus
};
