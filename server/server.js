require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('./models/Movie');
require('./models/Cinema');
require('./models/Showtime');
require('./models/Booking');
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const showtimeRoutes = require('./routes/showtimeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const configuredOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...new Set([
    ...configuredOrigins,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ]),
];

app.disable('x-powered-by');
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      const error = new Error('This origin is not allowed by CORS.');
      error.status = 403;
      return callback(error);
    },
  })
);
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CineBook API',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'CineBook API is running.',
    endpoints: {
      auth: '/api/auth',
      movies: '/api/movies',
      showtimes: '/api/showtimes',
      bookings: '/api/bookings',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  if (!process.env.JWT_SECRET) {
    console.error('\nConfiguration error: JWT_SECRET is missing from server/.env');
    console.error('Copy server/.env.example to server/.env and set a long random secret.\n');
    process.exit(1);
  }

  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`CineBook API listening on http://localhost:${PORT}`);
  });

  process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error.message);
    server.close(() => process.exit(1));
  });
};

startServer();
