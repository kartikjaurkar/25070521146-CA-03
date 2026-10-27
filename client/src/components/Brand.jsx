import { Link } from 'react-router-dom';

export default function Brand({ compact = false }) {
  return (
    <Link to="/" className={`brand${compact ? ' brand--compact' : ''}`} aria-label="CineBook home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <path
            d="M6 8.5C6 6.57 7.57 5 9.5 5h13C24.43 5 26 6.57 26 8.5v3.25c0 1.24-.74 2.36-1.88 2.85L16 18.5l-8.12-3.9A3.1 3.1 0 0 1 6 11.75V8.5Z"
            fill="currentColor"
          />
          <path
            d="M9 20.5v3A3.5 3.5 0 0 0 12.5 27h7a3.5 3.5 0 0 0 3.5-3.5v-3L16 24l-7-3.5Z"
            fill="currentColor"
            opacity=".55"
          />
        </svg>
      </span>
      <span className="brand-text">
        Cine<span>Book</span>
      </span>
    </Link>
  );
}
