const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getAllUsers,
    getSeatAvailability,
    getAllShowtimesAvailability,
    getAllBookings,
    updateUserRole,
    deleteUser,
    adminCancelBooking,
    getActivityLog
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All admin routes need auth + admin role
router.use(protect);
router.use(admin);

// Dashboard & Stats
router.get('/stats', getDashboardStats);
router.get('/activity', getActivityLog);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Booking Management
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/cancel', adminCancelBooking);

// Seat Availability
router.get('/seats/:showTimeId', getSeatAvailability);
router.get('/showtimes/availability', getAllShowtimesAvailability);

module.exports = router;
