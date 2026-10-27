const mongoose = require('mongoose');
const Showtime = require('../models/Showtime');
const asyncHandler = require('../middleware/asyncHandler');

const getShowtimes = asyncHandler(async (req, res) => {
  const { movieId, cinemaId, date } = req.query;
  const filter = {};

  if (movieId) {
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      res.status(400);
      throw new Error('Invalid movie ID.');
    }
    filter.movie = movieId;
  }

  if (cinemaId) {
    if (!mongoose.Types.ObjectId.isValid(cinemaId)) {
      res.status(400);
      throw new Error('Invalid cinema ID.');
    }
    filter.cinema = cinemaId;
  }

  if (date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
      res.status(400);
      throw new Error('Date must use YYYY-MM-DD format.');
    }
    filter.showDate = String(date);
  }

  const showtimes = await Showtime.find(filter)
    .populate('movie', 'title posterUrl genre duration language rating status')
    .populate('cinema', 'name location screens')
    .sort({ showDate: 1, startTime: 1 });

  res.json({
    count: showtimes.length,
    showtimes,
  });
});

const getShowtimeSeats = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid showtime ID.');
  }

  const showtime = await Showtime.findById(id)
    .populate('movie', 'title posterUrl bannerUrl genre duration language rating')
    .populate('cinema', 'name location screens');

  if (!showtime) {
    res.status(404);
    throw new Error('Showtime not found.');
  }

  const availableSeats = showtime.seats.filter((seat) => seat.status === 'available').length;

  res.json({
    showtime,
    availableSeats,
  });
});

module.exports = { getShowtimes, getShowtimeSeats };
