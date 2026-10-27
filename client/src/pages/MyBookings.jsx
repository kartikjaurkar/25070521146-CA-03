import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import RemoteImage from '../components/RemoteImage';
import { bookingService, getErrorMessage } from '../services/api';
import {
  formatCurrency,
  formatDate,
  formatShowDate,
  formatTime,
  getBookingStatusLabel,
  isShowtimePast,
} from '../utils/format';

const filters = [
  { value: 'all', label: 'All Bookings' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState('');

  useEffect(() => {
    let active = true;

    const loadBookings = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await bookingService.getMine();
        if (active) setBookings(data.bookings);
      } catch (requestError) {
        if (active) setError(getErrorMessage(requestError));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadBookings();

    return () => {
      active = false;
    };
  }, []);

  const enrichedBookings = bookings.map((booking) => ({
    ...booking,
    isPast: isShowtimePast(booking.showtime?.showDate, booking.showtime?.startTime),
  }));

  const counts = {
    all: enrichedBookings.length,
    upcoming: enrichedBookings.filter(
      (booking) => booking.bookingStatus === 'confirmed' && !booking.isPast
    ).length,
    past: enrichedBookings.filter(
      (booking) => booking.bookingStatus === 'confirmed' && booking.isPast
    ).length,
    cancelled: enrichedBookings.filter((booking) => booking.bookingStatus === 'cancelled')
      .length,
  };

  const filteredBookings = enrichedBookings.filter((booking) => {
    if (activeFilter === 'upcoming') {
      return booking.bookingStatus === 'confirmed' && !booking.isPast;
    }
    if (activeFilter === 'past') {
      return booking.bookingStatus === 'confirmed' && booking.isPast;
    }
    if (activeFilter === 'cancelled') {
      return booking.bookingStatus === 'cancelled';
    }
    return true;
  });

  const handleCancel = async (booking) => {
    const confirmed = window.confirm(
      `Cancel your booking for ${booking.movie?.title}? Your seats will be released.`
    );

    if (!confirmed) return;

    setCancellingId(booking._id);
    setError('');
    setSuccess('');

    try {
      const data = await bookingService.cancel(booking._id);
      setBookings((current) =>
        current.map((item) => (item._id === booking._id ? data.booking : item))
      );
      setSuccess('Booking cancelled successfully. Your seats are available again.');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setCancellingId('');
    }
  };

  return (
    <section className="my-bookings-page">
      <div className="container">
        <div className="my-bookings-header">
          <div>
            <p className="eyebrow">Your tickets</p>
            <h1>My bookings</h1>
            <p>Keep track of every movie night, past and upcoming.</p>
          </div>
          <Link to="/movies" className="btn btn-primary">
            Book Another Movie
          </Link>
        </div>

        <div className="booking-filter-tabs" role="tablist" aria-label="Filter bookings">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter.value}
              className={`booking-filter-tab${activeFilter === filter.value ? ' is-active' : ''}`}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
              <span>{counts[filter.value]}</span>
            </button>
          ))}
        </div>

        {success && (
          <Alert type="success" onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert type="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Loader label="Loading your bookings…" />
        ) : filteredBookings.length > 0 ? (
          <div className="bookings-list">
            {filteredBookings.map((booking) => {
              const canCancel = booking.bookingStatus === 'confirmed' && !booking.isPast;
              const statusClass =
                booking.bookingStatus === 'cancelled' ? 'cancelled' : booking.isPast ? 'past' : 'confirmed';
              const statusLabel =
                booking.bookingStatus === 'cancelled'
                  ? 'Cancelled'
                  : booking.isPast
                    ? 'Completed'
                    : 'Confirmed';

              return (
                <article key={booking._id} className={`booking-card booking-card--${statusClass}`}>
                  <div className="booking-card-poster">
                    <RemoteImage
                      src={booking.movie?.posterUrl}
                      alt={`${booking.movie?.title} poster`}
                      className="booking-poster-image"
                    />
                  </div>

                  <div className="booking-card-content">
                    <div className="booking-card-heading">
                      <div>
                        <div className="booking-heading-row">
                          <span className={`booking-status booking-status--${booking.bookingStatus}`}>
                            {statusLabel}
                          </span>
                          <span className="booking-code">{booking.bookingCode}</span>
                        </div>
                        <h2>{booking.movie?.title}</h2>
                        <p>
                          {booking.cinema?.name} <span>·</span> {booking.cinema?.location}
                        </p>
                      </div>
                      <div className="booking-price">
                        <span>Total</span>
                        <strong>{formatCurrency(booking.totalAmount)}</strong>
                      </div>
                    </div>

                    <div className="booking-info-grid">
                      <div>
                        <span>Show date</span>
                        <strong>{formatShowDate(booking.showtime?.showDate, { year: 'numeric' })}</strong>
                      </div>
                      <div>
                        <span>Showtime</span>
                        <strong>
                          {formatTime(booking.showtime?.startTime)} · {booking.showtime?.screen}
                        </strong>
                      </div>
                      <div>
                        <span>Seats</span>
                        <strong>{booking.seats.join(', ')}</strong>
                      </div>
                      <div>
                        <span>Booked on</span>
                        <strong>{formatDate(booking.createdAt)}</strong>
                      </div>
                    </div>

                    <div className="booking-card-footer">
                      <span>
                        {booking.numberOfTickets}{' '}
                        {booking.numberOfTickets === 1 ? 'ticket' : 'tickets'} ·{' '}
                        {getBookingStatusLabel(booking.bookingStatus)}
                      </span>
                      <div className="booking-actions">
                        {canCancel && (
                          <button
                            type="button"
                            className="btn btn-danger-ghost btn-sm"
                            onClick={() => handleCancel(booking)}
                            disabled={cancellingId === booking._id}
                          >
                            {cancellingId === booking._id ? 'Cancelling…' : 'Cancel Booking'}
                          </button>
                        )}
                        <Link to={`/booking/${booking._id}`} className="btn btn-secondary btn-sm">
                          Booking Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title={
              activeFilter === 'upcoming'
                ? 'No upcoming movie nights'
                : activeFilter === 'cancelled'
                  ? 'No cancelled bookings'
                  : activeFilter === 'past'
                    ? 'No past bookings yet'
                    : 'Your ticket wallet is empty'
            }
            message={
              activeFilter === 'upcoming'
                ? 'Pick a film and choose your seats to plan your next night out.'
                : 'Your bookings will appear here after you reserve seats.'
            }
            action={
              <Link to="/movies" className="btn btn-primary">
                Browse Movies
              </Link>
            }
          />
        )}
      </div>
    </section>
  );
}
