const Movie = require('../models/Movie');

// @desc    Get all movies
// @route   GET /api/movies
const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find({ isNowShowing: true });
        res.json(movies);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch movies' });
    }
};

// @desc    Get single movie by id
// @route   GET /api/movies/:id
const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        
        res.json(movie);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching movie' });
    }
};

// @desc    Create new movie (admin only)
// @route   POST /api/movies
const createMovie = async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json(movie);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Failed to create movie', error: error.message });
    }
};

// @desc    Update movie (admin only)
// @route   PUT /api/movies/:id
const updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        
        res.json(movie);
    } catch (error) {
        res.status(400).json({ message: 'Update failed' });
    }
};

// @desc    Delete movie (admin only)
// @route   DELETE /api/movies/:id
const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed' });
    }
};

// @desc    Search movies by title or genre
// @route   GET /api/movies/search
const searchMovies = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ message: 'Search query required' });
        }
        
        // search in title and genre
        const movies = await Movie.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { genre: { $regex: query, $options: 'i' } }
            ]
        });
        
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Search failed' });
    }
};

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
    searchMovies
};
