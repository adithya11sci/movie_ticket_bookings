const mongoose = require('mongoose');

// movie schema - stores all movie detials
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Movie title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add movie description']
    },
    genre: {
        type: [String],
        required: true
    },
    duration: {
        type: Number,  // in minutes
        required: true
    },
    language: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    posterUrl: {
        type: String,
        default: 'https://via.placeholder.com/300x450?text=No+Poster'
    },
    trailerUrl: {
        type: String
    },
    rating: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    isNowShowing: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Movie', movieSchema);
