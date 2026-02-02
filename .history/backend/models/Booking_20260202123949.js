const mongoose = require('mongoose');

// booking schema - stores user ticket bookings
const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    showTime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShowTime',
        required: true
    },
    seats: [{
        seatNumber: String,  // like "A1", "A2"
        seatType: {
            type: String,
            enum: ['regular', 'premium', 'vip'],
            default: 'regular'
        }
    }],
    totalSeats: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentId: {
        type: String  // for payment gateway reference
    },
    bookingStatus: {
        type: String,
        enum: ['confirmed', 'cancelled', 'pending'],
        default: 'pending'
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
