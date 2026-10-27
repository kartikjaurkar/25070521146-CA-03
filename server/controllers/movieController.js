const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const asyncHandler = require('../middleware/asyncHandler');
const escapeRegex = require('../utils/escapeRegex');

const VALID_STATUSES = ['now_showing', 'upcoming'];

const getMovies = asyncHandler(async (req, res) => {
  const { status, genre, search } = req.query;
  const filter = {};

  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      res.status(400);
      throw new Error('Invalid movie status filter.');
    }
    filter.status = status;
  }

  if (genre) {
    filter.genre = { $regex: new RegExp(`^${escapeRegex(String(genre))}$`, 'i') };
  }

  if (search) {
    filter.title = { $regex: escapeRegex(String(search).trim()), $options: 'i' };
  }

  const movies = await Movie.find(filter).sort({ status: 1, rating: -1, title: 1 });

  res.json({
    count: movies.length,
    movies,
  });
});

const searchMovies = asyncHandler(async (req, res) => {
  const query = String(req.query.q || '').trim();

  if (!query) {
    res.status(400);
    throw new Error('Please provide a search query using ?q=movieName.');
  }

  const safeQuery = escapeRegex(query);
  const movies = await Movie.find({
    title: { $regex: safeQuery, $options: 'i' },
  }).sort({ rating: -1, title: 1 });

  res.json({
    count: movies.length,
    query,
    movies,
  });
});

const getMovieById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid movie ID.');
  }

  const movie = await Movie.findById(id);

  if (!movie) {
    res.status(404);
    throw new Error('Movie not found.');
  }

  res.json({ movie });
});

module.exports = { getMovies, searchMovies, getMovieById };
