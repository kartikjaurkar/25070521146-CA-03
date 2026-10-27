import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import EmptyState from './EmptyState';

export default function MovieSection({ title, subtitle, movies, viewAllTo = '/movies', emptyMessage }) {
  return (
    <section className="movie-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{subtitle}</p>
            <h2>{title}</h2>
          </div>
          {viewAllTo && (
            <Link to={viewAllTo} className="text-link">
              View all
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </Link>
          )}
        </div>

        {movies.length > 0 ? (
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No movies to show"
            message={emptyMessage || 'New titles will appear here soon.'}
            small
          />
        )}
      </div>
    </section>
  );
}
