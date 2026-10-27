# CineBook - Movie Ticket Booking System

CineBook is a complete full-stack movie ticket booking application built with **React, Vite, Node.js, Express, MongoDB, and Mongoose**. Customers can browse the catalogue, choose a cinema and showtime, select seats, create an account, confirm a simulated payment, view their bookings, and cancel eligible bookings.

The project is split into two top-level application folders:

- `client/` - React single-page application
- `server/` - Express REST API and MongoDB models

## Features

- Premium dark cinema-inspired responsive interface
- Home page with featured movie, popular titles, now showing, and coming soon sections
- Movie catalogue with title search, genre filters, and status filters
- Movie details with synopsis, cast, rating, runtime, and showtimes
- Cinema, date, and showtime selection
- Interactive 80-seat map with live availability
- Maximum of 8 seats per booking
- Atomic seat reservation to reduce double-booking
- JWT authentication with hashed passwords
- Protected booking, seat, and booking-history pages
- Booking confirmation ticket with booking code
- My Bookings page with All, Upcoming, Past, and Cancelled filters
- Booking cancellation with automatic seat release
- Ownership protection: customers cannot view or cancel another customer's booking
- Simulated demo payment only - no real payment gateway
- Image fallback assets for missing or blocked remote images
- Mobile navigation and responsive layouts
- Seed script with 10 movies, 3 cinemas, and 360 showtimes

## Technology Stack

### Frontend

- React 18
- React Router DOM 7
- Axios
- Vite 8
- Plain CSS with responsive design

### Backend

- Node.js
- Express 4
- MongoDB
- Mongoose 8
- JSON Web Tokens
- bcryptjs
- CORS
- dotenv
- nodemon for development

## Project Structure

```text
25070521146/
|-- client/
|   |-- public/
|   |   |-- fallback-banner.svg
|   |   |-- fallback-poster.svg
|   |   `-- favicon.svg
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- utils/
|   |   |-- App.jsx
|   |   |-- index.css
|   |   `-- main.jsx
|   |-- .env
|   |-- .env.example
|   |-- index.html
|   |-- package.json
|   `-- vite.config.js
|-- server/
|   |-- config/
|   |-- controllers/
|   |-- data/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   |-- .env
|   |-- .env.example
|   |-- package.json
|   |-- seed.js
|   `-- server.js
|-- .gitignore
`-- README.md
```

## Prerequisites

Install the following before running the project:

1. **Node.js 22 LTS or newer** (tested with Node.js `24.14.1`)
2. **npm** (tested with npm `11.11.0`)
3. **MongoDB Community Server** running locally on port `27017`
4. A modern browser such as Chrome or Edge

MongoDB Compass is optional. It is only a visual database client and is not required for the application to run.

### Check MongoDB on Windows

Open PowerShell:

```powershell
Get-Service -Name MongoDB
```

The status should be `Running`.

If MongoDB is installed but stopped, start it from an Administrator PowerShell:

```powershell
Start-Service MongoDB
```

The application expects this default local connection string:

```text
mongodb://127.0.0.1:27017/cinebook
```

MongoDB creates the `cinebook` database automatically when the seed script first connects.

## Environment Variables

The repository already includes local `.env` files and `.env.example` templates. If a `.env` file is missing, create it by copying the example.

### Backend - `server/.env`

```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cinebook
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Generate a stronger JWT secret from the `server` folder:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Copy the generated value into `server/.env`. Never commit the real `.env` file.

### Frontend - `client/.env`

```dotenv
VITE_API_URL=http://localhost:5000/api
```

The API URL must include `/api`.

### Optional MongoDB Atlas Connection

To use MongoDB Atlas instead of local MongoDB, set `MONGODB_URI` in `server/.env` to your Atlas connection string, for example:

```dotenv
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.example.mongodb.net/cinebook
```

Also allow your IP address in the Atlas network access settings. Do not put real credentials in a public repository.

## Installation and Running

Use **two PowerShell terminals**: one for the backend and one for the frontend.

### Terminal 1 - Backend

```powershell
cd "C:\Users\ASUS\Desktop\25070521146\server"
npm install
npm run seed
npm run dev
```

Expected seed output:

```text
MongoDB connected: 127.0.0.1/cinebook
Movies: 10
Cinemas: 3
Showtimes: 360
Sample data is ready. Existing records were not duplicated.
```

Expected server output:

```text
CineBook API listening on http://localhost:5000
```

Verify the API in a browser or with PowerShell:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

### Terminal 2 - Frontend

```powershell
cd "C:\Users\ASUS\Desktop\25070521146\client"
npm install
npm run dev
```

Vite starts the application at:

```text
http://localhost:5173
```

The Vite configuration opens the browser automatically.

### Production Build Check

The frontend can be built and previewed with:

```powershell
cd "C:\Users\ASUS\Desktop\25070521146\client"
npm run build
npm run preview
```

The backend is still required while using the frontend preview.

## Seed Data

The seed script creates:

- **10 movies**: 8 now showing and 2 coming soon
- **3 cinemas**: CineBook Grand, Starlight Cinemas, and Nova Cineplex
- **3 daily showtimes per cinema** for each now-showing movie
- **5 days of showtimes**, resulting in **360 showtime records**
- **80 seats per showtime**, arranged as rows A-H with 10 seats per row
- Ticket prices based on cinema and showtime

Seeding is idempotent for movies, cinemas, and showtime identities. Running `npm run seed` again does not duplicate the same records and does not reset existing seat states. Re-run it on later days to add showtimes for the next five days.

The two upcoming movies do not have showtimes and cannot be booked until their status is changed in the seed data and the database is reseeded or edited.

## Booking and Seat Integrity

Seat reservation is handled by the server, not only by the browser.

1. The server validates the showtime, seat format, seat existence, maximum seat count, and showtime start time.
2. It atomically marks selected available seats as booked with a conditional MongoDB update.
3. If another customer booked the same seat first, the request returns HTTP `409` and the frontend refreshes the seat map.
4. If booking creation fails after seats are reserved, the server attempts to release those seats again.
5. Cancelling a confirmed booking marks it cancelled/refunded and releases its seats.
6. Cancellation is rejected after the showtime has started.

This project intentionally uses a standalone-MongoDB-friendly design rather than requiring multi-document transactions.

## API Reference

Base URL:

```text
http://localhost:5000/api
```

Protected routes require this header:

```text
Authorization: Bearer <token>
```

### Authentication

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Create an account |
| POST | `/auth/login` | No | Log in and receive a JWT |
| GET | `/auth/me` | Yes | Return the current user |

### Movies

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/movies` | No | List movies; supports `status` and `genre` |
| GET | `/movies/search?q=title` | No | Search movies by title |
| GET | `/movies/:id` | No | Get one movie |

### Showtimes

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/showtimes` | No | List showtimes; supports `movieId`, `cinemaId`, and `date` |
| GET | `/showtimes/:id/seats` | No | Get a showtime with its seat map |

### Bookings

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/bookings` | Yes | Book selected seats |
| GET | `/bookings/my` | Yes | List the current user's bookings |
| GET | `/bookings/:id` | Yes | Get one owned booking |
| PATCH | `/bookings/:id/cancel` | Yes | Cancel an owned eligible booking |

### Example Request Body

```json
{
  "showtimeId": "SHOWTIME_OBJECT_ID",
  "seats": ["A1", "A2"]
}
```

### Common Status Codes

- `200` - Request succeeded
- `201` - Account or booking created
- `400` - Invalid input, past showtime, or invalid booking state
- `401` - Missing, invalid, or expired login token
- `403` - Disallowed CORS origin
- `404` - Resource not found or not owned by the current user
- `409` - Duplicate account or seats already booked
- `500` - Unexpected server error

## Demo Payment

Payment is simulated. A booking is created as paid and confirmed immediately. No card details are collected and no real payment provider is used. This is an academic demonstration project.

## Manual Testing Checklist

Use this checklist after starting both servers and seeding the database.

- [ ] `http://localhost:5000/api/health` returns `status: ok`
- [ ] `http://localhost:5173` loads without console errors
- [ ] Home page shows featured, popular, now-showing, and coming-soon content
- [ ] Movie search finds a title such as `Interstellar`
- [ ] Genre and status filters update the catalogue
- [ ] Movie details show synopsis, cast, rating, and runtime
- [ ] Movie details show five date tabs and cinema showtimes
- [ ] Clicking a showtime while logged out redirects to login
- [ ] Registration validates name, email, password length, and confirmation
- [ ] Login accepts a registered account and restores the session after refresh
- [ ] Seat map displays 80 seats and supports selecting/deselecting seats
- [ ] Selecting more than 8 seats is blocked
- [ ] Booking creates a confirmation page with a `CB-...` booking code
- [ ] Booked seats appear unavailable in the seat map
- [ ] A second booking for the same seats is rejected and the map refreshes
- [ ] My Bookings lists the new reservation
- [ ] Cancelling a booking shows a success message
- [ ] Cancelled seats become available again
- [ ] A second cancellation attempt is rejected
- [ ] Another account cannot open or cancel the first account's booking
- [ ] Logout returns to Home, and protected pages redirect to login
- [ ] Layout remains usable at mobile width without horizontal scrolling
- [ ] Stopping the backend shows a helpful connection error in the frontend

## Troubleshooting

### `mongod` is not recognized

This is common on Windows because MongoDB runs as a service and `mongod` may not be on `PATH`. You do not need to run `mongod` manually if the service is running.

```powershell
Get-Service -Name MongoDB
Start-Service MongoDB
```

If MongoDB is not installed, install MongoDB Community Server for Windows and enable the MongoDB service.

### `MongooseServerSelectionError` or `ECONNREFUSED 127.0.0.1:27017`

MongoDB is not running or the connection string is wrong.

1. Start the MongoDB service.
2. Check `MONGODB_URI` in `server/.env`.
3. Confirm the port is `27017`, unless your installation uses another port.

### Port 5000 is already in use

Find the process using the port:

```powershell
Get-NetTCPConnection -LocalPort 5000 -State Listen | Select-Object OwningProcess
Get-Process -Id <PID>
```

Stop the conflicting process, or change `PORT` in `server/.env`. If you change the backend port, also update `VITE_API_URL` in `client/.env` and restart Vite.

### Port 5173 is already in use

Stop the old Vite process. Vite may otherwise choose another port, in which case the browser URL and backend `CLIENT_URL` must match the actual frontend origin.

### Frontend says it cannot connect to CineBook

- Confirm the backend terminal still shows `CineBook API listening`.
- Confirm `VITE_API_URL` is `http://localhost:5000/api`.
- Restart Vite after changing `client/.env`.
- Check whether Windows Firewall prompts were dismissed.

### CORS error in the browser

Set `CLIENT_URL` in `server/.env` to the exact frontend origin, for example:

```dotenv
CLIENT_URL=http://localhost:5173
```

Restart the backend after changing environment variables. `http://127.0.0.1:5173` is also allowed by default.

### Login appears successful but protected pages still redirect

The token must be valid for the same backend and JWT secret. Clear the site's local storage in the browser and log in again. Restarting with a changed `JWT_SECRET` invalidates existing tokens.

### No movies or showtimes appear

Run the seed script from the `server` folder:

```powershell
npm run seed
```

For upcoming movies, no showtimes are expected by design.

### Remote images do not load

Poster and banner images use external TMDB and Unsplash URLs. If network access is blocked, the frontend automatically displays local fallback SVG images. This does not prevent browsing or booking.

### Reset all application data

To completely reset the database, drop the `cinebook` database using MongoDB Compass, then run:

```powershell
cd "C:\Users\ASUS\Desktop\25070521146\server"
npm run seed
```

Dropping the database also deletes all registered users and bookings.

## Security Notes

- Passwords are hashed with bcrypt before storage.
- JWT-protected routes enforce authentication and booking ownership.
- The `JWT_SECRET` value must be changed and never committed.
- `.env` files and `node_modules` are excluded by `.gitignore`.
- The API limits JSON bodies to 20 KB and validates inputs.
- CORS only accepts configured local frontend origins by default.
- No real payment details are collected or stored.

This is a learning/demo application. For production, add rate limiting, request logging, email verification, password reset, HTTPS, a real payment provider, and stronger operational monitoring.

## Known Limitations

- Payment is simulated.
- There is no admin dashboard for adding movies, cinemas, or showtimes.
- There is no email verification or password reset.
- Seeded showtimes are relative to the day the seed script is run.
- Old showtimes are not automatically deleted.
- Image availability depends on third-party image hosts, with local fallbacks provided.
- Automated tests are not included as a committed test suite; the application has been manually verified with API integration and browser end-to-end checks.

## Verification Completed

- Frontend production build passes with Vite 8.
- Backend JavaScript files pass Node syntax checks.
- `npm audit` reports zero vulnerabilities for both `client` and `server`.
- Seed runs successfully with 10 movies, 3 cinemas, and 360 showtimes.
- API flows verified: health, register, duplicate registration, login, invalid login, current user, movie list, search, details, showtimes, seats, booking, duplicate-seat rejection, my bookings, ownership protection, cancellation, seat release, and repeated-cancellation rejection.
- Desktop browser flow verified: home, catalogue search, registration, movie details, seat selection, confirmation, booking history, session restore, cancellation, logout, and protected-route redirect.
- Mobile browser checks passed at a 390 px viewport on login, registration, home, catalogue, movie details, seat selection, and My Bookings with no horizontal overflow or runtime console errors.
