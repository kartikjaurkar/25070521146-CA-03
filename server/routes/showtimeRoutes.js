const express = require('express');
const {
  getShowtimes,
  getShowtimeSeats,
} = require('../controllers/showtimeController');

const router = express.Router();

router.get('/', getShowtimes);
router.get('/:id/seats', getShowtimeSeats);

module.exports = router;
