const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    getAllBookings,
    updatePaymentStatus
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

// all booking routes need authentication
router.use(protect);

// user routes
router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/payment', updatePaymentStatus);

// admin routes
router.get('/', admin, getAllBookings);

module.exports = router;
