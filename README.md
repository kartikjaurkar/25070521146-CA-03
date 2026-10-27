A full-stack movie booking app built with React 18 + Vite (frontend) and Node.js + Express + MongoDB/Mongoose (backend). Users can browse movies, pick a cinema and showtime, select seats, pay (simulated), and manage bookings.

Key Features
Movie catalogue with search, genre and status filters
Showtime selection and an interactive 80-seat map (max 8 seats per booking)
Atomic seat reservation to prevent double-booking (returns 409 on conflict)
JWT auth with bcrypt-hashed passwords; users can only view or cancel their own bookings
My Bookings page with cancellation and automatic seat release
Responsive dark UI with image fallbacks
Seed script: 10 movies, 3 cinemas, 360 showtimes
Structure
client/: React SPA
server/: Express REST API, models, seed script
Quick Start

Requires Node.js 22+, npm, and MongoDB running on port 27017.

Backend: cd server, then npm install, npm run seed, npm run dev (runs on port 5000)
Frontend: cd client, then npm install, npm run dev (runs on port 5173)

Config: server/.env needs PORT, MONGODB_URI, JWT_SECRET, CLIENT_URL. client/.env needs VITE_API_URL=http://localhost:5000/api.

API Overview
Auth: POST /auth/register, POST /auth/login, GET /auth/me
Movies: GET /movies, /movies/search, /movies/:id
Showtimes: GET /showtimes, /showtimes/:id/seats
Bookings: POST /bookings, GET /bookings/my, GET /bookings/:id, PATCH /bookings/:id/cancel
Limitations
Payment is simulated only
No admin dashboard, email verification, or password reset
No committed automated test suite (manually verified)
Seeded showtimes are relative to the seed date, so re-run the seed to add new days
Common Fixes
MongoDB connection error: start the MongoDB service and check MONGODB_URI
CORS error: make CLIENT_URL match the frontend origin exactly
Port in use: change PORT and update VITE_API_URL
No movies showing: run npm run seed