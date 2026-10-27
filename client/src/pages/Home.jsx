import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import MovieSection from '../components/MovieSection';
import RemoteImage from '../components/RemoteImage';
import { getErrorMessage, movieService } from '../services/api';
import { formatDate, formatDuration } from '../utils/format';

const categories = [
  { name: 'Action', tagline: 'High-stakes thrills' },
  { name: 'Comedy', tagline: 'Laugh out loud' },
  { name: 'Drama', tagline: 'Stories that stay' },
  { name: 'Thriller', tagline: 'Edge-of-your-seat' },
  { name: 'Romance', tagline: 'Feel the connection' },
  { name: 'Sci-Fi', tagline: 'Beyond imagination' },
];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const loadMovies = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await movieService.getAll();
        if (active) setMovies(data.movies);
      } catch (requestError) {
        if (active) setError(getErrorMessage(requestError));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadMovies();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const nowShowing = movies.filter((movie) => movie.status === 'now_showing');
  const upcoming = movies.filter((movie) => movie.status === 'upcoming');
  const popular = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const featured =
    movies.find((movie) => movie.featured) || nowShowing[0] || movies[0] || null;

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/movies?q=${encodeURIComponent(query)}` : '/movies');
  };

  if (loading) {
    return <Loader label="Loading the CineBook lineup…" />;
  }

  if (error) {
    return (
      <section className="page-section">
        <div className="container narrow-container">
          <Alert type="error">{error}</Alert>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setRefreshKey((current) => current + 1)}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      {featured ? (
        <section className="hero">
          <RemoteImage
            src={featured.bannerUrl}
            alt=""
            className="hero-backdrop"
            fallback="/fallback-banner.svg"
            loading="eager"
          />
          <div className="hero-shade" />

          <div className="container hero-content">
            <div className="hero-copy">
              <p className="eyebrow eyebrow--light">
                <span className="live-dot" />
                Featured presentation
              </p>
              <h1>{featured.title}</h1>
              <div className="hero-meta">
                <span className="hero-rating">
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      d="m10 2.8 2.12 4.3 4.74.69-3.43 3.34.81 4.72L10 13.62l-4.24 2.23.81-4.72-3.43-3.34 4.74-.69L10 2.8Z"
                      fill="currentColor"
                    />
                  </svg>
                  {Number(featured.rating).toFixed(1)}
                </span>
                <span>{formatDuration(featured.duration)}</span>
                <span>{featured.language}</span>
                <span>{formatDate(featured.releaseDate, { year: 'numeric' })}</span>
              </div>
              <p className="hero-description">{featured.description}</p>
              <div className="genre-row">
                {featured.genre.map((genre) => (
                  <span key={genre} className="genre-chip">
                    {genre}
                  </span>
                ))}
              </div>
              <div className="hero-actions">
                <Link
                  to={`/movies/${featured._id}#showtimes`}
                  className="btn btn-primary btn-lg"
                >
                  Book Tickets
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      d="M4 10h12M12 6l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </Link>
                <Link to={`/movies/${featured._id}`} className="btn btn-glass btn-lg">
                  More Details
                </Link>
              </div>
            </div>

            <div className="hero-poster-card">
              <RemoteImage
                src={featured.posterUrl}
                alt={`${featured.title} poster`}
                className="hero-poster"
                loading="eager"
              />
              <div className="hero-poster-caption">
                <span>Now Showing</span>
                <strong>{featured.language}</strong>
              </div>
            </div>
          </div>

          <div className="container hero-search-wrap">
            <form className="hero-search" onSubmit={handleSearch} role="search">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
                <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search movies by title…"
                aria-label="Search movies by title"
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>
          </div>
        </section>
      ) : (
        <section className="page-section">
          <div className="container">
            <EmptyState
              title="The screen is still dark"
              message="No movies are available yet. Run the seed script to load the CineBook catalogue."
            />
          </div>
        </section>
      )}

      <section className="category-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Browse by mood</p>
              <h2>Find your genre</h2>
            </div>
          </div>
          <div className="category-grid">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/movies?genre=${encodeURIComponent(category.name)}`}
                className="category-card"
              >
                <span className="category-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="category-arrow" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none">
                    <path
                      d="M4 10h12M12 6l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <h3>{category.name}</h3>
                <p>{category.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <MovieSection
        title="Popular right now"
        subtitle="Top rated"
        movies={popular}
        viewAllTo="/movies"
      />
      <MovieSection
        title="Now showing"
        subtitle="On the big screen"
        movies={nowShowing}
        viewAllTo="/movies?status=now_showing"
      />
      <MovieSection
        title="Coming soon"
        subtitle="Mark your calendar"
        movies={upcoming}
        viewAllTo="/movies?status=upcoming"
        emptyMessage="New releases will be announced soon."
      />

      <section className="experience-section">
        <div className="container experience-card">
          <div>
            <p className="eyebrow">The CineBook experience</p>
            <h2>Pick a film. Choose a seat. Make it a night.</h2>
          </div>
          <div className="experience-steps">
            <div>
              <span>01</span>
              <strong>Choose a movie</strong>
              <p>Browse current releases and upcoming premieres.</p>
            </div>
            <div>
              <span>02</span>
              <strong>Find your show</strong>
              <p>Compare cinemas, dates, times, and ticket prices.</p>
            </div>
            <div>
              <span>03</span>
              <strong>Select your seats</strong>
              <p>Live seat availability with instant booking confirmation.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
