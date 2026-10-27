import { Link } from 'react-router-dom';
import Brand from './Brand';

const categories = ['Action', 'Comedy', 'Drama', 'Thriller', 'Romance', 'Sci-Fi'];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Brand />
          <p>
            Your next great movie night starts here. Discover films, choose your
            perfect seats, and book in seconds.
          </p>
          <span className="footer-demo">Demo project · Payments are simulated</span>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/movies">All Movies</Link>
          <Link to="/movies?status=now_showing">Now Showing</Link>
          <Link to="/movies?status=upcoming">Coming Soon</Link>
        </div>

        <div className="footer-column">
          <h3>Categories</h3>
          {categories.map((category) => (
            <Link key={category} to={`/movies?genre=${encodeURIComponent(category)}`}>
              {category}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <h3>Your Account</h3>
          <Link to="/login">Login</Link>
          <Link to="/register">Create Account</Link>
          <Link to="/my-bookings">My Bookings</Link>
          <a href="mailto:support@cinebook.demo">support@cinebook.demo</a>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {year} CineBook. Built for learning and demonstration.</p>
        <p>Dark cinema experience · Desktop, tablet &amp; mobile ready</p>
      </div>
    </footer>
  );
}
