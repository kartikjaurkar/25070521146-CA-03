export default function Alert({ type = 'error', children, onClose }) {
  if (!children) return null;

  return (
    <div className={`alert alert--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <span className="alert-icon" aria-hidden="true">
        {type === 'success' ? (
          <svg viewBox="0 0 20 20" fill="none">
            <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : type === 'info' ? (
          <svg viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 9v4M10 6.8v.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 6v5M10 13.8v.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        )}
      </span>
      <span className="alert-message">{children}</span>
      {onClose && (
        <button type="button" className="alert-close" onClick={onClose} aria-label="Dismiss message">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m6 6 8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
