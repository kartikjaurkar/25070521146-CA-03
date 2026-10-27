const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
      trim: true,
    },
    posterUrl: {
      type: String,
      required: [true, 'Poster URL is required'],
      trim: true,
    },
    bannerUrl: {
      type: String,
      required: [true, 'Banner URL is required'],
      trim: true,
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required'],
      validate: {
        validator: (genres) => Array.isArray(genres) && genres.length > 0,
        message: 'At least one genre is required',
      },
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be greater than zero'],
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [0, 'Rating cannot be less than 0'],
      max: [10, 'Rating cannot be greater than 10'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    cast: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['now_showing', 'upcoming'],
      default: 'now_showing',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

movieSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
