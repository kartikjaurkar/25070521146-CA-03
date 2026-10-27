const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Cinema name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Cinema location is required'],
      trim: true,
    },
    screens: {
      type: [String],
      default: ['Screen 1'],
    },
  },
  {
    timestamps: true,
  }
);

cinemaSchema.index({ name: 1, location: 1 }, { unique: true });

module.exports = mongoose.model('Cinema', cinemaSchema);
