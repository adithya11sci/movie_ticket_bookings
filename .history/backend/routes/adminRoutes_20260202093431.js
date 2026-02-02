const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getAllUsers,
    getSeatAvailability
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// all admin routes need auth + admin role
router.use(protect);
router.use(admin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/seats/:showTimeId', getSeatAvailability);

module.exports = router;
