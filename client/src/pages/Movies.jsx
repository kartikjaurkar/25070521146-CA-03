import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import MovieCard from '../components/MovieCard';
import { getErrorMessage, movieService } from '../services/api';

const genres = ['All', 'Action', 'Comedy', 'Drama', 'Thriller', 'Romance', 'Sci-Fi'];

const statusOptions = [
  { value: 'all', label: 'All Movies' },
  { value: 'now_showing', label: 'Now Showing' },
  { value: 'upcoming', label: 'Coming Soon' },
];

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const genre = searchParams.get('genre') || 'All';
  const status = searchParams.get('status') || 'all';

  const [searchInput, setSearchInput] = useState(query);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    let active = true;

    const loadMovies = async () => {
      setLoading(true);
      setError('');

      try {
        let results = [];

        if (query) {
          const data = await movieService.search(query);
          results = data.movies || [];

          if (genre !== 'All') {
            results = results.filter((movie) => movie.genre.includes(genre));
          }

          if (status !== 'all') {
            results = results.filter((movie) => movie.status === status);
          }
        } else {
          const params = {};
          if (genre !== 'All') params.genre = genre;
          if (status !== 'all') params.status = status;

          const data = await movieService.getAll(params);
          results = data.movies || [];
        }

        if (active) setMovies(results);
      } catch (requestError) {
        if (active) {
          setMovies([]);
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadMovies();

    return () => {
      active = false;
    };
  }, [query, genre, status]);

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);

    if (!value || value === 'All' || value === 'all') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    setSearchParams(nextParams);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    updateParam('q', searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasFilters = Boolean(query) || genre !== 'All' || status !== 'all';

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-inner">
          <div>
            <p className="eyebrow">The full lineup</p>
            <h1>Find your next favorite film</h1>
            <p>
              Search current releases and upcoming premieres, then choose the show
              that fits your night.
            </p>
          </div>

          <form className="catalog-search" onSubmit={handleSearch} role="search">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by movie title…"
              aria-label="Search movies"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="page-section catalog-section">
        <div className="container">
          <div className="catalog-filters">
            <div className="filter-group">
              <span className="filter-label">Status</span>
              <div className="filter-pills">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`filter-pill${status === option.value ? ' is-active' : ''}`}
                    onClick={() => updateParam('status', option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-label">Genre</span>
              <div className="filter-pills filter-pills--wrap">
                {genres.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`filter-pill${genre === item ? ' is-active' : ''}`}
                    onClick={() => updateParam('genre', item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="catalog-toolbar">
            <p>
              {loading
                ? 'Searching the catalogue…'
                : `${movies.length} ${movies.length === 1 ? 'movie' : 'movies'} found`}
              {query && !loading ? ` for “${query}”` : ''}
            </p>
            {hasFilters && (
              <button type="button" className="text-button" onClick={clearFilters}>
                Clear all filters
              </button>
            )}
          </div>

          {error && <Alert type="error">{error}</Alert>}

          {loading ? (
            <Loader label="Loading movies…" />
          ) : movies.length > 0 ? (
            <div className="movie-grid movie-grid--catalog">
              {movies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          ) : (
            !error && (
              <EmptyState
                title="No movies matched your search"
                message="Try another title, choose a different genre, or clear your filters."
                action={
                  <button type="button" className="btn btn-primary" onClick={clearFilters}>
                    Show All Movies
                  </button>
                }
              />
            )
          )}
        </div>
      </section>
    </>
  );
}
