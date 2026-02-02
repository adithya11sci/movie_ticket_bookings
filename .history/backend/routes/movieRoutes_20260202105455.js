const express = require('express');
const router = express.Router();
const {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
    searchMovies
} = require('../controllers/movieController');
const { protect, admin } = require('../middleware/authMiddleware');

// public routes
router.get('/', getAllMovies);
router.get('/search', searchMovies);
router.get('/:id', getMovieById);

// admin only routes
router.post('/', protect, admin, createMovie);
router.put('/:id', protect, admin, updateMovie);
router.delete('/:id', protect, admin, deleteMovie);

module.exports = router;
