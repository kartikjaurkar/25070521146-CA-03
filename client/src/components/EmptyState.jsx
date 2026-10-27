export default function EmptyState({
  title = 'Nothing here yet',
  message = 'Try a different search or come back later.',
  action = null,
  small = false,
}) {
  return (
    <div className={`empty-state${small ? ' empty-state--small' : ''}`}>
      <span className="empty-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="7" y="10" width="34" height="28" rx="4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 18h34M15 10l4 8M25 10l4 8M35 10l4 8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M18 27h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}
