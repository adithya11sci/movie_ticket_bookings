const mongoose = require('mongoose');

// Seat lock schema for concurrent booking prevention
const seatLockSchema = new mongoose.Schema({
    seatNumber: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['available', 'locked', 'booked'],
        default: 'available'
    },
    lockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lockExpiry: { type: Date },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { _id: false });

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
        premium: { type: Number, required: true },
        vip: { type: Number, default: 480 }
    },
    // track which seats are booked (legacy - for backward compatibility)
    bookedSeats: [{
        type: String  // like "A1", "B5" etc
    }],
    // NEW: Detailed seat status with locking for concurrency
    seatStatus: [seatLockSchema],
    availableSeats: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

// Index for faster seat queries
showTimeSchema.index({ 'seatStatus.seatNumber': 1 });

module.exports = mongoose.model('ShowTime', showTimeSchema);
