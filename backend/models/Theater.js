const mongoose = require('mongoose');

// theater schema - represents a cinema hall
const theaterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Theater name is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    city: {
        type: String,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
    // seat layout - rows and columns
    seatLayout: {
        rows: { type: Number, default: 10 },
        columns: { type: Number, default: 12 }
    },
    amenities: {
        type: [String],
        default: []  // like parking, food court etc
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Theater', theaterSchema);
