export default function Loader({ label = 'Loading…', compact = false }) {
  if (compact) {
    return (
      <span className="inline-loader" role="status" aria-live="polite">
        <span className="spinner spinner--small" aria-hidden="true" />
        <span>{label}</span>
      </span>
    );
  }

  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}
