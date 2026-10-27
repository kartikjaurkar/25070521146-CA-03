import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
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
  getPaymentStatusLabel,
} from '../utils/format';

export default function BookingConfirmation() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isNewBooking = searchParams.get('new') === '1';

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadBooking = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await bookingService.getById(id);
        if (active) setBooking(data.booking);
      } catch (requestError) {
        if (active) setError(getErrorMessage(requestError));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadBooking();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <Loader label="Loading your booking…" />;
  }

  if (error || !booking) {
    return (
      <section className="page-section">
        <div className="container">
          <EmptyState
            title="Booking not found"
            message={error || 'This booking does not exist or does not belong to your account.'}
            action={
              <Link to="/my-bookings" className="btn btn-primary">
                View My Bookings
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  const { movie, cinema, showtime } = booking;
  const isCancelled = booking.bookingStatus === 'cancelled';

  return (
    <section className="confirmation-page">
      <div className="container">
        <header className="confirmation-header">
          <span className={`confirmation-icon${isCancelled ? ' is-cancelled' : ''}`}>
            {isCancelled ? (
              <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="m10 10 12 12M22 10 10 22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="m7 17 6 6L26 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <p className="eyebrow">{isNewBooking ? 'Booking complete' : 'Your ticket'}</p>
          <h1>{isCancelled ? 'This booking was cancelled' : 'Your seats are confirmed'}</h1>
          <p>
            {isCancelled
              ? 'The seats from this booking have been released for other guests.'
              : 'Your booking has been saved successfully. We look forward to seeing you at the movies.'}
          </p>
        </header>

        {isNewBooking && !isCancelled && (
          <Alert type="success">
            Booking confirmed. This was a simulated demo payment — no real money was charged.
          </Alert>
        )}

        <div className="confirmation-grid">
          <article className={`ticket-card${isCancelled ? ' is-cancelled' : ''}`}>
            <div className="ticket-main">
              <div className="ticket-poster">
                <RemoteImage
                  src={movie.posterUrl}
                  alt={`${movie.title} poster`}
                  className="ticket-poster-image"
                />
              </div>

              <div className="ticket-content">
                <div className="ticket-topline">
                  <span className={`booking-status booking-status--${booking.bookingStatus}`}>
                    {getBookingStatusLabel(booking.bookingStatus)}
                  </span>
                  <span className="ticket-genres">{movie.genre?.slice(0, 2).join(' · ')}</span>
                </div>

                <h2>{movie.title}</h2>
                <p className="ticket-cinema">
                  {cinema?.name} <span>·</span> {cinema?.location}
                </p>

                <div className="ticket-info-grid">
                  <div>
                    <span>Show date</span>
                    <strong>{formatShowDate(showtime?.showDate, { year: 'numeric' })}</strong>
                  </div>
                  <div>
                    <span>Showtime</span>
                    <strong>{formatTime(showtime?.startTime)}</strong>
                  </div>
                  <div>
                    <span>Screen</span>
                    <strong>{showtime?.screen || 'Main screen'}</strong>
                  </div>
                  <div>
                    <span>Tickets</span>
                    <strong>{booking.numberOfTickets}</strong>
                  </div>
                  <div className="ticket-info-wide">
                    <span>Seats</span>
                    <strong>{booking.seats.join(', ')}</strong>
                  </div>
                  <div>
                    <span>Total paid</span>
                    <strong>{formatCurrency(booking.totalAmount)}</strong>
                  </div>
                  <div>
                    <span>Payment</span>
                    <strong>{getPaymentStatusLabel(booking.paymentStatus)}</strong>
                  </div>
                </div>

                <div className="booking-reference">
                  <span>Booking ID</span>
                  <code>{booking._id}</code>
                </div>
              </div>
            </div>

            <div className="ticket-stub">
              <span className="stub-label">Booking code</span>
              <strong>{booking.bookingCode}</strong>
              <div className="barcode" aria-hidden="true">
                {Array.from({ length: 28 }).map((_, index) => (
                  <span key={index} style={{ width: `${(index % 4) + 1}px` }} />
                ))}
              </div>
              <span className="stub-note">Present this code at the cinema entrance.</span>
            </div>
          </article>

          <aside className="confirmation-side">
            <div className="confirmation-card">
              <h2>Trip details</h2>
              <dl className="confirmation-details">
                <div>
                  <dt>Booked on</dt>
                  <dd>{formatDate(booking.createdAt)}</dd>
                </div>
                <div>
                  <dt>Number of tickets</dt>
                  <dd>{booking.numberOfTickets}</dd>
                </div>
                <div>
                  <dt>Seat numbers</dt>
                  <dd>{booking.seats.join(', ')}</dd>
                </div>
                <div>
                  <dt>Booking status</dt>
                  <dd>{getBookingStatusLabel(booking.bookingStatus)}</dd>
                </div>
                <div>
                  <dt>Payment status</dt>
                  <dd>{getPaymentStatusLabel(booking.paymentStatus)}</dd>
                </div>
              </dl>

              <p className="demo-note">
                Payment was simulated for this academic project. No card or real payment
                gateway was used.
              </p>

              <div className="confirmation-actions">
                <Link to="/my-bookings" className="btn btn-primary btn-block">
                  View All Bookings
                </Link>
                <Link to="/" className="btn btn-secondary btn-block">
                  Return to Home
                </Link>
              </div>
            </div>

            {!isCancelled && (
              <div className="confirmation-tip">
                <h3>Need to change plans?</h3>
                <p>
                  You can cancel this booking from My Bookings before the showtime
                  begins. Your seats will be released automatically.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
