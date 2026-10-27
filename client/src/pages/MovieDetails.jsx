import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import RemoteImage from '../components/RemoteImage';
import { getErrorMessage, movieService, showtimeService } from '../services/api';
import {
  formatCurrency,
  formatDate,
  formatDuration,
  formatShowDate,
  formatTime,
} from '../utils/format';

const getDateParts = (dateString) => {
  const date = new Date(`${dateString}T12:00:00`);

  return {
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
    day: date.toLocaleDateString('en-US', { day: '2-digit' }),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
  };
};

export default function MovieDetails() {
  const { id } = useParams();
  const location = useLocation();
  const showtimesRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [movieLoading, setMovieLoading] = useState(true);
  const [showtimeLoading, setShowtimeLoading] = useState(true);
  const [movieError, setMovieError] = useState('');
  const [showtimeError, setShowtimeError] = useState('');

  useEffect(() => {
    let active = true;

    const loadMovie = async () => {
      setMovieLoading(true);
      setMovieError('');

      try {
        const data = await movieService.getById(id);
        if (active) setMovie(data.movie);
      } catch (error) {
        if (active) setMovieError(getErrorMessage(error));
      } finally {
        if (active) setMovieLoading(false);
      }
    };

    const loadShowtimes = async () => {
      setShowtimeLoading(true);
      setShowtimeError('');

      try {
        const data = await showtimeService.getAll({ movieId: id });

        if (active) {
          setShowtimes(data.showtimes);
          setSelectedDate((current) => {
            if (data.showtimes.some((showtime) => showtime.showDate === current)) {
              return current;
            }
            return data.showtimes[0]?.showDate || '';
          });
        }
      } catch (error) {
        if (active) setShowtimeError(getErrorMessage(error));
      } finally {
        if (active) setShowtimeLoading(false);
      }
    };

    loadMovie();
    loadShowtimes();

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (movieLoading || showtimeLoading || location.hash !== '#showtimes') return undefined;

    const timer = window.setTimeout(() => {
      showtimesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [movieLoading, showtimeLoading, location.hash]);

  if (movieLoading) {
    return <Loader label="Loading movie details…" />;
  }

  if (movieError || !movie) {
    return (
      <section className="page-section">
        <div className="container">
          <EmptyState
            title="Movie not found"
            message={movieError || 'This movie may have been removed from the catalogue.'}
            action={
              <Link to="/movies" className="btn btn-primary">
                Browse Movies
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  const dates = [...new Set(showtimes.map((showtime) => showtime.showDate))].sort();
  const selectedShows = showtimes.filter((showtime) => showtime.showDate === selectedDate);
  const cinemaMap = new Map();

  selectedShows.forEach((showtime) => {
    if (!showtime.cinema) return;
    const key = showtime.cinema._id;

    if (!cinemaMap.has(key)) {
      cinemaMap.set(key, {
        cinema: showtime.cinema,
        shows: [],
      });
    }

    cinemaMap.get(key).shows.push(showtime);
  });

  const cinemaGroups = [...cinemaMap.values()].sort((a, b) =>
    a.cinema.name.localeCompare(b.cinema.name)
  );

  const scrollToShowtimes = () => {
    showtimesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section className="detail-hero">
        <RemoteImage
          src={movie.bannerUrl}
          alt=""
          className="detail-hero-backdrop"
          fallback="/fallback-banner.svg"
          loading="eager"
        />
        <div className="detail-hero-shade" />

        <div className="container detail-hero-content">
          <div className="detail-poster-card">
            <RemoteImage
              src={movie.posterUrl}
              alt={`${movie.title} poster`}
              className="detail-poster"
              loading="eager"
            />
          </div>

          <div className="detail-copy">
            <div className="detail-badges">
              <span className={`status-pill${movie.status === 'upcoming' ? ' status-pill--upcoming' : ''}`}>
                {movie.status === 'upcoming' ? 'Coming Soon' : 'Now Showing'}
              </span>
              <span className="detail-language">{movie.language}</span>
            </div>

            <h1>{movie.title}</h1>
            <div className="detail-meta">
              <span className="rating-inline">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="m10 2.8 2.12 4.3 4.74.69-3.43 3.34.81 4.72L10 13.62l-4.24 2.23.81-4.72-3.43-3.34 4.74-.69L10 2.8Z"
                    fill="currentColor"
                  />
                </svg>
                {Number(movie.rating).toFixed(1)} / 10
              </span>
              <span>{formatDuration(movie.duration)}</span>
              <span>Released {formatDate(movie.releaseDate)}</span>
            </div>

            <div className="genre-row">
              {movie.genre.map((genre) => (
                <span key={genre} className="genre-chip">
                  {genre}
                </span>
              ))}
            </div>

            <p className="detail-hero-description">{movie.description}</p>

            <div className="hero-actions">
              <button type="button" className="btn btn-primary btn-lg" onClick={scrollToShowtimes}>
                Book Tickets
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M4 10h12M12 6l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <Link to="/movies" className="btn btn-glass btn-lg">
                Back to Movies
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section detail-body-section">
        <div className="container detail-body">
          <div className="detail-main">
            <div className="content-block">
              <p className="eyebrow">The story</p>
              <h2>Synopsis</h2>
              <p className="long-copy">{movie.description}</p>
            </div>

            <div className="content-block">
              <p className="eyebrow">On screen</p>
              <h2>Cast</h2>
              {movie.cast.length > 0 ? (
                <div className="cast-list">
                  {movie.cast.map((person) => (
                    <span key={person} className="cast-chip">
                      <span className="cast-initial">{person.charAt(0)}</span>
                      {person}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="muted-copy">Cast information is not available yet.</p>
              )}
            </div>
          </div>

          <aside className="detail-side-card">
            <h2>Movie details</h2>
            <dl className="detail-facts">
              <div>
                <dt>Status</dt>
                <dd>{movie.status === 'upcoming' ? 'Coming Soon' : 'Now Showing'}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{formatDuration(movie.duration)}</dd>
              </div>
              <div>
                <dt>Language</dt>
                <dd>{movie.language}</dd>
              </div>
              <div>
                <dt>Release date</dt>
                <dd>{formatDate(movie.releaseDate)}</dd>
              </div>
              <div>
                <dt>Rating</dt>
                <dd>{Number(movie.rating).toFixed(1)} / 10</dd>
              </div>
              <div>
                <dt>Genres</dt>
                <dd>{movie.genre.join(', ')}</dd>
              </div>
            </dl>
            <p className="demo-note">
              Seat availability and pricing are verified by the CineBook server at
              checkout.
            </p>
          </aside>
        </div>
      </section>

      <section className="showtimes-section" ref={showtimesRef} id="showtimes">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Choose your screening</p>
              <h2>Available showtimes</h2>
            </div>
          </div>

          {showtimeError && <Alert type="error">{showtimeError}</Alert>}

          {showtimeLoading ? (
            <Loader label="Loading showtimes…" />
          ) : movie.status === 'upcoming' ? (
            <EmptyState
              title="Tickets are not on sale yet"
              message={`${movie.title} arrives on ${formatDate(movie.releaseDate)}. Check back soon for showtimes.`}
              action={
                <Link to="/movies?status=upcoming" className="btn btn-secondary">
                  Explore Coming Soon
                </Link>
              }
            />
          ) : showtimes.length > 0 ? (
            <>
              <div className="date-tabs" role="tablist" aria-label="Select show date">
                {dates.map((date) => {
                  const parts = getDateParts(date);
                  return (
                    <button
                      key={date}
                      type="button"
                      role="tab"
                      aria-selected={selectedDate === date}
                      className={`date-tab${selectedDate === date ? ' is-active' : ''}`}
                      onClick={() => setSelectedDate(date)}
                    >
                      <span>{parts.weekday}</span>
                      <strong>{parts.day}</strong>
                      <small>{parts.month}</small>
                    </button>
                  );
                })}
              </div>

              <div className="cinema-list">
                {cinemaGroups.map(({ cinema, shows }) => (
                  <article key={cinema._id} className="cinema-show-card">
                    <div className="cinema-info">
                      <div className="cinema-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path
                            d="M4 8.5h16M6 5h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path d="M9 5v3M15 5v3M8 15h8" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </div>
                      <div>
                        <h3>{cinema.name}</h3>
                        <p>{cinema.location}</p>
                      </div>
                    </div>

                    <div className="showtime-list">
                      {shows
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map((showtime) => (
                          <Link
                            key={showtime._id}
                            to={`/book/${showtime._id}`}
                            className="showtime-button"
                          >
                            <strong>{formatTime(showtime.startTime)}</strong>
                            <span>
                              {showtime.screen} · {formatCurrency(showtime.ticketPrice)}
                            </span>
                          </Link>
                        ))}
                    </div>
                  </article>
                ))}
              </div>

              <p className="showtime-caption">
                Showing {formatShowDate(selectedDate, { year: 'numeric' })} · Select a
                time to choose your seats.
              </p>
            </>
          ) : (
            <EmptyState
              title="No showtimes available"
              message="There are no upcoming screenings for this movie right now."
              action={
                <Link to="/movies?status=now_showing" className="btn btn-secondary">
                  Browse Now Showing
                </Link>
              }
            />
          )}
        </div>
      </section>
    </>
  );
}
