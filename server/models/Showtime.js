const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['available', 'booked'],
      default: 'available',
    },
  },
  { _id: false }
);

const showtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie is required'],
      index: true,
    },
    cinema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cinema',
      required: [true, 'Cinema is required'],
      index: true,
    },
    showDate: {
      type: String,
      required: [true, 'Show date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Show date must use YYYY-MM-DD format'],
      index: true,
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Start time must use HH:MM format'],
    },
    screen: {
      type: String,
      default: 'Screen 1',
      trim: true,
    },
    ticketPrice: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: [0, 'Ticket price cannot be negative'],
    },
    seats: {
      type: [seatSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

showtimeSchema.index(
  { movie: 1, cinema: 1, showDate: 1, startTime: 1 },
  { unique: true }
);

module.exports = mongoose.model('Showtime', showtimeSchema);
