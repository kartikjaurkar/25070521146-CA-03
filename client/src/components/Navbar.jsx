import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Brand from './Brand';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/format';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/movies', label: 'Movies' },
  { to: '/my-bookings', label: 'My Bookings' },
];

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pendingLogout, setPendingLogout] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!pendingLogout || location.pathname !== '/') return;

    setPendingLogout(false);
    logout();
  }, [pendingLogout, location.pathname, logout]);

  useEffect(() => {
    const closeProfile = (event) => {
      if (!event.target.closest('.profile-menu')) {
        setProfileOpen(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setProfileOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', closeProfile);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('click', closeProfile);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    setMenuOpen(false);

    if (location.pathname === '/') {
      logout();
      return;
    }

    setPendingLogout(true);
    navigate('/', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Brand />

        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          {!loading && user && (
            <div className={`profile-menu${profileOpen ? ' is-open' : ''}`}>
              <button
                type="button"
                className="profile-trigger"
                onClick={() => setProfileOpen((current) => !current)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <span className="avatar">{getInitials(user.name)}</span>
                <span className="profile-name">{user.name.split(' ')[0]}</span>
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </button>

              <div className="profile-dropdown" role="menu">
                <div className="profile-summary">
                  <span className="avatar avatar--large">{getInitials(user.name)}</span>
                  <div>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>
                <Link to="/my-bookings" className="dropdown-link" role="menuitem">
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      d="M4 3.5h12A1.5 1.5 0 0 1 17.5 5v2a2 2 0 0 0 0 4v2A1.5 1.5 0 0 1 16 14.5H4A1.5 1.5 0 0 1 2.5 13v-2a2 2 0 0 0 0-4V5A1.5 1.5 0 0 1 4 3.5Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                  My Bookings
                </Link>
                <button type="button" className="dropdown-link" onClick={handleLogout} role="menuitem">
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      d="M8 3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3M13 14l4-4-4-4M17 10H8"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Log out
                </button>
              </div>
            </div>
          )}

          {!loading && !user && (
            <div className="auth-actions">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}

          <button
            type="button"
            className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`mobile-menu${menuOpen ? ' is-open' : ''}`}>
        <div className="container mobile-menu-inner">
          {user && (
            <div className="mobile-user">
              <span className="avatar">{getInitials(user.name)}</span>
              <div>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
            </div>
          )}

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `mobile-nav-link${isActive ? ' is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}

          {user ? (
            <button type="button" className="btn btn-secondary mobile-auth-button" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <div className="mobile-auth-actions">
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
