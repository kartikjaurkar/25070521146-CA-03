const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    cinema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cinema',
      required: true,
    },
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
      required: true,
    },
    seats: {
      type: [String],
      required: true,
      validate: {
        validator: (seats) => Array.isArray(seats) && seats.length > 0,
        message: 'At least one seat is required',
      },
    },
    numberOfTickets: {
      type: Number,
      required: true,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'paid',
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
