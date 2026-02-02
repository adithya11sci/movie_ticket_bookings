const express = require('express');
const router = express.Router();
const {
    getAllTheaters,
    getTheaterById,
    createTheater,
    updateTheater,
    deleteTheater
} = require('../controllers/theaterController');
const { protect, admin } = require('../middleware/authMiddleware');

// public routes
router.get('/', getAllTheaters);
router.get('/:id', getTheaterById);

// admin routes
router.post('/', protect, admin, createTheater);
router.put('/:id', protect, admin, updateTheater);
router.delete('/:id', protect, admin, deleteTheater);

module.exports = router;
