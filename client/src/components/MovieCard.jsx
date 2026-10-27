import { Link } from 'react-router-dom';
import RemoteImage from './RemoteImage';
import { formatDate, formatDuration } from '../utils/format';

export default function MovieCard({ movie }) {
  const isUpcoming = movie.status === 'upcoming';

  return (
    <article className="movie-card">
      <Link to={`/movies/${movie._id}`} className="movie-poster-wrap" aria-label={`View ${movie.title}`}>
        <RemoteImage
          src={movie.posterUrl}
          alt={`${movie.title} poster`}
          className="movie-poster"
          loading="lazy"
        />
        <span className={`status-pill${isUpcoming ? ' status-pill--upcoming' : ''}`}>
          {isUpcoming ? 'Coming Soon' : 'Now Showing'}
        </span>
        <span className="rating-pill">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="m10 2.8 2.12 4.3 4.74.69-3.43 3.34.81 4.72L10 13.62l-4.24 2.23.81-4.72-3.43-3.34 4.74-.69L10 2.8Z"
              fill="currentColor"
            />
          </svg>
          {Number(movie.rating).toFixed(1)}
        </span>
        <span className="poster-overlay">
          <span>View Details</span>
        </span>
      </Link>

      <div className="movie-card-body">
        <p className="movie-genres">{movie.genre.slice(0, 2).join(' · ')}</p>
        <h3>
          <Link to={`/movies/${movie._id}`}>{movie.title}</Link>
        </h3>
        <div className="movie-card-meta">
          <span>{formatDuration(movie.duration)}</span>
          <span className="meta-dot" />
          <span>{movie.language}</span>
        </div>
        <p className="movie-release">{formatDate(movie.releaseDate, { year: 'numeric' })}</p>

        <div className="movie-card-actions">
          <Link to={`/movies/${movie._id}`} className="btn btn-secondary btn-sm">
            View Details
          </Link>
          <Link to={`/movies/${movie._id}#showtimes`} className="btn btn-primary btn-sm">
            Book Tickets
          </Link>
        </div>
      </div>
    </article>
  );
}
