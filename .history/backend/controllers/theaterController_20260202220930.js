const Theater = require('../models/Theater');
const ShowTime = require('../models/ShowTime');
const Booking = require('../models/Booking');

// @desc    Get all theaters
// @route   GET /api/theaters
const getAllTheaters = async (req, res) => {
    try {
        const theaters = await Theater.find({ isActive: true });
        res.json(theaters);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get theaters' });
    }
};

// @desc    Get theater by id
// @route   GET /api/theaters/:id
const getTheaterById = async (req, res) => {
    try {
        const theater = await Theater.findById(req.params.id);
        
        if (!theater) {
            return res.status(404).json({ message: 'Theater not found' });
        }
        
        res.json(theater);
    } catch (error) {
        res.status(500).json({ message: 'Error getting theater' });
    }
};

// @desc    Create theater (admin)
// @route   POST /api/theaters
const createTheater = async (req, res) => {
    try {
        const theater = await Theater.create(req.body);
        res.status(201).json(theater);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create theater', error: error.message });
    }
};

// @desc    Update theater (admin)
// @route   PUT /api/theaters/:id
const updateTheater = async (req, res) => {
    try {
        const theater = await Theater.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!theater) {
            return res.status(404).json({ message: 'Theater not found' });
        }
        
        res.json(theater);
    } catch (error) {
        res.status(400).json({ message: 'Update failed' });
    }
};

// @desc    Delete theater (admin)
// @route   DELETE /api/theaters/:id
const deleteTheater = async (req, res) => {
    try {
        await Theater.findByIdAndDelete(req.params.id);
        res.json({ message: 'Theater deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed' });
    }
};

module.exports = {
    getAllTheaters,
    getTheaterById,
    createTheater,
    updateTheater,
    deleteTheater
};
