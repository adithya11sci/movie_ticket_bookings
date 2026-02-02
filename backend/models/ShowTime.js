const mongoose = require('mongoose');

// showtime schema - links movie to theater with time
const showTimeSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    theater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theater',
        required: true
    },
    showDate: {
        type: Date,
        required: true
    },
    showTime: {
        type: String,  // like "10:00 AM", "2:30 PM"
        required: true
    },
    price: {
        regular: { type: Number, required: true },
        premium: { type: Number, required: true }
    },
    // track which seats are booked
    bookedSeats: [{
        type: String  // like "A1", "B5" etc
    }],
    availableSeats: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('ShowTime', showTimeSchema);
