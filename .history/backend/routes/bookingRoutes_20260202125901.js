const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

// all booking routes need authentication
router.use(protect);

// seat locking routes (for concurrent booking)
router.post('/lock-seats', lockSeats);
router.post('/release-seats', releaseSeats);

// get user's seats for a specific showtime
router.get('/showtime/:showTimeId/my-seats', getMySeatsForShowtime);
router.get('/showtime/:showTimeId/seat-status', getSeatStatus);

// user routes
router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/payment', updatePaymentStatus);

// admin routes
router.get('/', admin, getAllBookings);

module.exports = router;
