const express = require('express');
const router = express.Router();
const {
    getAllShowTimes,
    getShowTimesByMovie,
    getShowTimeById,
    createShowTime,
    updateShowTime,
    deleteShowTime,
    getShowtimeDeletionImpact
} = require('../controllers/showTimeController');
const { protect, admin } = require('../middleware/authMiddleware');

// public routes
router.get('/', getAllShowTimes);
router.get('/movie/:movieId', getShowTimesByMovie);
router.get('/:id', getShowTimeById);

// admin routes
router.post('/', protect, admin, createShowTime);
router.put('/:id', protect, admin, updateShowTime);
router.get('/:id/deletion-impact', protect, admin, getShowtimeDeletionImpact);
router.delete('/:id', protect, admin, deleteShowTime);

module.exports = router;
