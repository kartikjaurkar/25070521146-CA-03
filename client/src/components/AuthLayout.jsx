import RemoteImage from './RemoteImage';

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <section className="auth-page">
      <div className="container auth-grid">
        <aside className="auth-visual">
          <RemoteImage
            src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1400&q=85"
            alt=""
            className="auth-visual-image"
            fallback="/fallback-banner.svg"
          />
          <div className="auth-visual-shade" />
          <div className="auth-visual-content">
            <p className="eyebrow eyebrow--light">A better movie night</p>
            <h2>Every seat. Every show. One place.</h2>
            <p>
              Discover films, compare showtimes, and reserve your favorite seats in
              a few clicks.
            </p>
            <ul className="auth-benefits">
              <li>
                <span aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none">
                    <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </span>
                Live seat availability
              </li>
              <li>
                <span aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none">
                    <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </span>
                Secure JWT authentication
              </li>
              <li>
                <span aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none">
                    <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </span>
                All your bookings in one place
              </li>
            </ul>
            <p className="auth-demo-note">Demo payments · No real charges</p>
          </div>
        </aside>

        <div className="auth-card">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
        </div>
      </div>
    </section>
  );
}
