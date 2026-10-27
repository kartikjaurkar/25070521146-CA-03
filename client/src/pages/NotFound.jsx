import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="not-found-page">
      <div className="container not-found-inner">
        <p className="eyebrow">404 · Scene missing</p>
        <h1>This page is not in the script.</h1>
        <p>
          The link may be broken, or the page may have moved. Head back to the
          cinema and find something good to watch.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link to="/movies" className="btn btn-secondary">
            Browse Movies
          </Link>
        </div>
      </div>
    </section>
  );
}
