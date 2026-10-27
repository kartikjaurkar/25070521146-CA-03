const crypto = require('crypto');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const asyncHandler = require('../middleware/asyncHandler');
const { isShowtimeInPast } = require('../utils/dateHelpers');

const MAX_SEATS_PER_BOOKING = 8;
const SEAT_PATTERN = /^[A-Z]\d{1,2}$/;

const bookingPopulate = [
  {
    path: 'movie',
    select: 'title posterUrl bannerUrl genre duration language rating releaseDate',
  },
  { path: 'cinema', select: 'name location screens' },
  { path: 'showtime', select: 'showDate startTime screen ticketPrice' },
];

const makeBookingCode = () =>
  `CB-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

const normalizeSeats = (seats) =>
  seats.map((seat) => String(seat).trim().toUpperCase());

const createBooking = asyncHandler(async (req, res) => {
  const { showtimeId, seats } = req.body;

  if (!showtimeId || !mongoose.Types.ObjectId.isValid(showtimeId)) {
    res.status(400);
    throw new Error('A valid showtime is required.');
  }

  if (!Array.isArray(seats) || seats.length === 0) {
    res.status(400);
    throw new Error('Please select at least one seat.');
  }

  if (seats.length > MAX_SEATS_PER_BOOKING) {
    res.status(400);
    throw new Error(`You can book a maximum of ${MAX_SEATS_PER_BOOKING} seats at a time.`);
  }

  const normalizedSeats = normalizeSeats(seats);

  if (normalizedSeats.some((seat) => !SEAT_PATTERN.test(seat))) {
    res.status(400);
    throw new Error('One or more seat numbers are invalid.');
  }

  const uniqueSeats = [...new Set(normalizedSeats)];

  if (uniqueSeats.length !== normalizedSeats.length) {
    res.status(400);
    throw new Error('Duplicate seats are not allowed in one booking.');
  }

  const showtime = await Showtime.findById(showtimeId);

  if (!showtime) {
    res.status(404);
    throw new Error('Showtime not found.');
  }

  if (isShowtimeInPast(showtime.showDate, showtime.startTime)) {
    res.status(400);
    throw new Error('This showtime has already started. Please choose another show.');
  }

  const seatsByNumber = new Map(
    showtime.seats.map((seat) => [seat.seatNumber, seat.status])
  );

  const unknownSeats = uniqueSeats.filter((seat) => !seatsByNumber.has(seat));

  if (unknownSeats.length > 0) {
    res.status(400);
    throw new Error(`These seats do not exist for this showtime: ${unknownSeats.join(', ')}.`);
  }

  const unavailableSeats = uniqueSeats.filter(
    (seat) => seatsByNumber.get(seat) !== 'available'
  );

  if (unavailableSeats.length > 0) {
    res.status(409);
    throw new Error(
      `These seats are no longer available: ${unavailableSeats.join(', ')}. Please choose different seats.`
    );
  }

  const totalAmount =
    Math.round(showtime.ticketPrice * uniqueSeats.length * 100) / 100;

  const seatConditions = uniqueSeats.map((seatNumber) => ({
    $elemMatch: {
      seatNumber,
      status: 'available',
    },
  }));

  const reservedShowtime = await Showtime.findOneAndUpdate(
    {
      _id: showtime._id,
      seats: { $all: seatConditions },
    },
    {
      $set: { 'seats.$[selectedSeat].status': 'booked' },
    },
    {
      arrayFilters: [
        {
          'selectedSeat.seatNumber': { $in: uniqueSeats },
          'selectedSeat.status': 'available',
        },
      ],
      new: true,
    }
  );

  if (!reservedShowtime) {
    res.status(409);
    throw new Error(
      'Another customer just booked one or more of these seats. Please select different seats.'
    );
  }

  let booking;

  try {
    booking = await Booking.create({
      bookingCode: makeBookingCode(),
      user: req.user._id,
      movie: showtime.movie,
      cinema: showtime.cinema,
      showtime: showtime._id,
      seats: uniqueSeats,
      numberOfTickets: uniqueSeats.length,
      totalAmount,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
    });
  } catch (error) {
    await Showtime.updateOne(
      { _id: showtime._id },
      { $set: { 'seats.$[selectedSeat].status': 'available' } },
      {
        arrayFilters: [
          {
            'selectedSeat.seatNumber': { $in: uniqueSeats },
            'selectedSeat.status': 'booked',
          },
        ],
      }
    );

    throw error;
  }

  const populatedBooking = await Booking.findById(booking._id).populate(bookingPopulate);

  res.status(201).json({
    message: 'Booking confirmed. This was a simulated demo payment.',
    booking: populatedBooking,
  });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate(bookingPopulate)
    .sort({ createdAt: -1 });

  res.json({
    count: bookings.length,
    bookings,
  });
});

const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid booking ID.');
  }

  const booking = await Booking.findOne({
    _id: id,
    user: req.user._id,
  }).populate(bookingPopulate);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found.');
  }

  res.json({ booking });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid booking ID.');
  }

  const booking = await Booking.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found.');
  }

  if (booking.bookingStatus === 'cancelled') {
    res.status(400);
    throw new Error('This booking is already cancelled.');
  }

  const showtime = await Showtime.findById(booking.showtime).select(
    'showDate startTime'
  );

  if (!showtime) {
    res.status(404);
    throw new Error('The showtime for this booking could not be found.');
  }

  if (isShowtimeInPast(showtime.showDate, showtime.startTime)) {
    res.status(400);
    throw new Error('This show has already started, so it can no longer be cancelled.');
  }

  const cancelledBooking = await Booking.findOneAndUpdate(
    {
      _id: booking._id,
      user: req.user._id,
      bookingStatus: 'confirmed',
    },
    {
      $set: {
        bookingStatus: 'cancelled',
        paymentStatus: 'refunded',
      },
    },
    { new: true }
  );

  if (!cancelledBooking) {
    res.status(409);
    throw new Error('This booking could not be cancelled because its status changed.');
  }

  try {
    await Showtime.updateOne(
      { _id: booking.showtime },
      { $set: { 'seats.$[selectedSeat].status': 'available' } },
      {
        arrayFilters: [
          {
            'selectedSeat.seatNumber': { $in: booking.seats },
            'selectedSeat.status': 'booked',
          },
        ],
      }
    );
  } catch (error) {
    await Booking.updateOne(
      { _id: booking._id },
      { $set: { bookingStatus: 'confirmed', paymentStatus: 'paid' } }
    );
    throw error;
  }

  const populatedBooking = await Booking.findById(cancelledBooking._id).populate(
    bookingPopulate
  );

  res.json({
    message: 'Booking cancelled successfully. Seats are available again.',
    booking: populatedBooking,
  });
});

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
