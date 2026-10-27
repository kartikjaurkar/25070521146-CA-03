require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Movie = require('./models/Movie');
const Cinema = require('./models/Cinema');
const Showtime = require('./models/Showtime');
const { generateSeats } = require('./utils/generateSeats');
const { addDaysToDateString } = require('./utils/dateHelpers');
const {
  sampleMovies,
  sampleCinemas,
  showTimes,
  showDateOffsets,
} = require('./data/sampleData');

const seedDatabase = async () => {
  await connectDB();

  console.log('\nSeeding CineBook sample data...\n');

  await Movie.bulkWrite(
    sampleMovies.map((movie) => ({
      updateOne: {
        filter: { title: movie.title },
        update: { $set: movie },
        upsert: true,
      },
    }))
  );

  await Cinema.bulkWrite(
    sampleCinemas.map((cinema) => ({
      updateOne: {
        filter: { name: cinema.name, location: cinema.location },
        update: { $set: cinema },
        upsert: true,
      },
    }))
  );

  const movies = await Movie.find({
    title: { $in: sampleMovies.map((movie) => movie.title) },
  });
  const cinemas = await Cinema.find({
    name: { $in: sampleCinemas.map((cinema) => cinema.name) },
  });

  const nowShowingMovies = movies.filter((movie) => movie.status === 'now_showing');
  const seatTemplate = generateSeats();
  const showtimeOperations = [];

  nowShowingMovies.forEach((movie) => {
    showDateOffsets.forEach((dayOffset) => {
      const showDate = addDaysToDateString(dayOffset);

      cinemas.forEach((cinema, cinemaIndex) => {
        showTimes.forEach((startTime, timeIndex) => {
          const screen = cinema.screens[(cinemaIndex + timeIndex) % cinema.screens.length];
          const screenPrices = {
            IMAX: 1200,
            'Dolby Atmos': 800,
            '4DX': 1000,
          };
          const basePrice = screenPrices[screen] ?? 320;
          const showHour = Number(startTime.split(':')[0]);
          const timePremium = showHour >= 18 ? 120 : showHour >= 16 ? 80 : 0;
          const cinemaPremium = cinemaIndex * 40;
          const ticketPrice = basePrice + timePremium + cinemaPremium;

          showtimeOperations.push({
            updateOne: {
              filter: {
                movie: movie._id,
                cinema: cinema._id,
                showDate,
                startTime,
              },
              update: {
                $set: { ticketPrice },
                $setOnInsert: {
                  movie: movie._id,
                  cinema: cinema._id,
                  showDate,
                  startTime,
                  screen,
                  seats: seatTemplate.map((seat) => ({ ...seat })),
                },
              },
              upsert: true,
            },
          });
        });
      });
    });
  });

  if (showtimeOperations.length > 0) {
    await Showtime.bulkWrite(showtimeOperations);
  }

  const totalMovies = await Movie.countDocuments();
  const totalCinemas = await Cinema.countDocuments();
  const totalShowtimes = await Showtime.countDocuments();

  console.log(`Movies: ${totalMovies}`);
  console.log(`Cinemas: ${totalCinemas}`);
  console.log(`Showtimes: ${totalShowtimes}`);
  console.log('\nSample data is ready. Existing records were not duplicated.');
  console.log('Now-starting showtimes were created for the next five days.\n');
};

seedDatabase()
  .catch((error) => {
    console.error('\nSeeding failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
