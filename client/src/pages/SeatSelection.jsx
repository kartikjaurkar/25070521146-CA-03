import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import RemoteImage from '../components/RemoteImage';
import { bookingService, getErrorMessage, showtimeService } from '../services/api';
import {
  formatCurrency,
  formatShowDate,
  formatTime,
  isShowtimePast,
} from '../utils/format';

const MAX_SEATS = 8;

const sortSeatNumbers = (a, b) =>
  a.charAt(0).localeCompare(b.charAt(0)) ||
  Number(a.slice(1)) - Number(b.slice(1));

export default function SeatSelection() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();

  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [actionError, setActionError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSeats = async () => {
      setLoading(true);
      setPageError('');

      try {
        const data = await showtimeService.getSeats(showtimeId);
        if (active) setShowtime(data.showtime);
      } catch (error) {
        if (active) setPageError(getErrorMessage(error));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSeats();

    return () => {
      active = false;
    };
  }, [showtimeId]);

  const refreshSeats = async () => {
    const data = await showtimeService.getSeats(showtimeId);
    setShowtime(data.showtime);
    setSelectedSeats((current) =>
      current.filter(
        (seatNumber) =>
          data.showtime.seats.find((seat) => seat.seatNumber === seatNumber)?.status ===
          'available'
      )
    );
  };

  if (loading) {
    return <Loader label="Loading the seat map…" />;
  }

  if (pageError || !showtime) {
    return (
      <section className="page-section">
        <div className="container">
          <EmptyState
            title="Showtime unavailable"
            message={pageError || 'We could not find this showtime.'}
            action={
              <Link to="/movies" className="btn btn-primary">
                Browse Movies
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  const rowMap = new Map();

  showtime.seats.forEach((seat) => {
    const row = seat.seatNumber.replace(/\d+/g, '') || '?';
    if (!rowMap.has(row)) rowMap.set(row, []);
    rowMap.get(row).push(seat);
  });

  const seatRows = [...rowMap.entries()]
    .sort(([rowA], [rowB]) => rowA.localeCompare(rowB))
    .map(([row, seats]) => ({
      row,
      seats: [...seats].sort(
        (a, b) => Number(a.seatNumber.slice(1)) - Number(b.seatNumber.slice(1))
      ),
    }));

  const availableCount = showtime.seats.filter(
    (seat) => seat.status === 'available'
  ).length;
  const sortedSeats = [...selectedSeats].sort(sortSeatNumbers);
  const totalAmount = showtime.ticketPrice * selectedSeats.length;
  const pastShow = isShowtimePast(showtime.showDate, showtime.startTime);

  const toggleSeat = (seat) => {
    if (seat.status === 'booked' || pastShow) return;

    setActionError('');

    if (selectedSeats.includes(seat.seatNumber)) {
      setSelectedSeats((current) =>
        current.filter((seatNumber) => seatNumber !== seat.seatNumber)
      );
      return;
    }

    if (selectedSeats.length >= MAX_SEATS) {
      setActionError(`You can select a maximum of ${MAX_SEATS} seats per booking.`);
      return;
    }

    setSelectedSeats((current) => [...current, seat.seatNumber]);
  };

  const handleBooking = async () => {
    setActionError('');

    if (selectedSeats.length === 0) {
      setActionError('Please select at least one seat before proceeding.');
      return;
    }

    if (pastShow) {
      setActionError('This showtime has already started. Please choose another show.');
      return;
    }

    setSubmitting(true);

    try {
      const data = await bookingService.create({
        showtimeId,
        seats: sortedSeats,
      });
      navigate(`/booking/${data.booking._id}?new=1`);
    } catch (error) {
      setActionError(getErrorMessage(error));

      if (error.response?.status === 409) {
        try {
          await refreshSeats();
        } catch (refreshError) {
          setActionError(`${getErrorMessage(error)} ${getErrorMessage(refreshError)}`);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="seat-page">
      <div className="container">
        <div className="booking-steps" aria-label="Booking progress">
          <span className="is-complete">Movie</span>
          <span className="is-complete">Showtime</span>
          <span className="is-current">Seats</span>
          <span>Confirmation</span>
        </div>

        <div className="seat-page-header">
          <div>
            <Link to={`/movies/${showtime.movie._id}#showtimes`} className="back-link">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M16 10H4M8 6l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Change showtime
            </Link>
            <p className="eyebrow">Reserve your spot</p>
            <h1>Choose your seats</h1>
            <p>
              {showtime.movie.title} · {showtime.cinema.name} ·{' '}
              {formatShowDate(showtime.showDate)} at {formatTime(showtime.startTime)}
            </p>
          </div>

          <div className="seat-availability">
            <strong>{availableCount}</strong>
            <span>seats available</span>
          </div>
        </div>

        {pastShow && (
          <Alert type="error">
            This showtime has already started. You can browse other showtimes from the
            movie page.
          </Alert>
        )}
        {actionError && (
          <Alert type="error" onClose={() => setActionError('')}>
            {actionError}
          </Alert>
        )}

        <div className="seat-layout">
          <div className="seat-panel">
            <div className="screen-wrap">
              <div className="cinema-screen" />
              <span>Screen · {showtime.screen}</span>
            </div>

            <div className="seat-map-scroll">
              <div className="seat-map">
                {seatRows.map(({ row, seats }) => (
                  <div className="seat-row" key={row}>
                    <span className="row-label">{row}</span>
                    <div className="seat-buttons">
                      {seats.map((seat) => {
                        const isSelected = selectedSeats.includes(seat.seatNumber);
                        const isBooked = seat.status === 'booked';
                        const seatClass = isBooked
                          ? 'seat seat--booked'
                          : isSelected
                            ? 'seat seat--selected'
                            : 'seat seat--available';

                        return (
                          <button
                            key={seat.seatNumber}
                            type="button"
                            className={seatClass}
                            onClick={() => toggleSeat(seat)}
                            disabled={isBooked || pastShow}
                            aria-label={`Seat ${seat.seatNumber}, ${
                              isBooked ? 'booked' : isSelected ? 'selected' : 'available'
                            }`}
                            aria-pressed={isSelected}
                            title={`Seat ${seat.seatNumber}`}
                          >
                            <span>{seat.seatNumber.slice(1)}</span>
                          </button>
                        );
                      })}
                    </div>
                    <span className="row-label">{row}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="seat-legend">
              <span>
                <i className="legend-seat legend-seat--available" />
                Available
              </span>
              <span>
                <i className="legend-seat legend-seat--selected" />
                Selected
              </span>
              <span>
                <i className="legend-seat legend-seat--booked" />
                Booked
              </span>
            </div>

            <p className="seat-map-note">
              All seat numbers are shown on the seat backs. You may select up to{' '}
              {MAX_SEATS} seats.
            </p>
          </div>

          <aside className="booking-summary">
            <p className="eyebrow">Your selection</p>
            <h2>Booking summary</h2>

            <div className="summary-movie">
              <RemoteImage
                src={showtime.movie.posterUrl}
                alt={`${showtime.movie.title} poster`}
                className="summary-poster"
              />
              <div>
                <strong>{showtime.movie.title}</strong>
                <span>{showtime.cinema.name}</span>
                <span>{showtime.cinema.location}</span>
              </div>
            </div>

            <dl className="summary-details">
              <div>
                <dt>Date</dt>
                <dd>{formatShowDate(showtime.showDate, { year: 'numeric' })}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{formatTime(showtime.startTime)}</dd>
              </div>
              <div>
                <dt>Screen</dt>
                <dd>{showtime.screen}</dd>
              </div>
              <div>
                <dt>Price per ticket</dt>
                <dd>{formatCurrency(showtime.ticketPrice)}</dd>
              </div>
            </dl>

            <div className="selected-seats-block">
              <span className="summary-label">Selected seats</span>
              {sortedSeats.length > 0 ? (
                <div className="selected-seats">
                  {sortedSeats.map((seatNumber) => (
                    <button
                      key={seatNumber}
                      type="button"
                      className="selected-seat-chip"
                      onClick={() =>
                        setSelectedSeats((current) =>
                          current.filter((seat) => seat !== seatNumber)
                        )
                      }
                      aria-label={`Remove seat ${seatNumber}`}
                    >
                      {seatNumber}
                      <span aria-hidden="true">×</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="muted-copy">No seats selected yet.</p>
              )}
            </div>

            <div className="summary-totals">
              <div>
                <span>
                  Tickets <small>({selectedSeats.length})</small>
                </span>
                <strong>{formatCurrency(totalAmount)}</strong>
              </div>
              <div className="summary-total-row">
                <span>Total</span>
                <strong>{formatCurrency(totalAmount)}</strong>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-block btn-lg"
              onClick={handleBooking}
              disabled={submitting || selectedSeats.length === 0 || pastShow}
            >
              {submitting ? 'Confirming…' : 'Proceed to Booking'}
            </button>

            <p className="demo-note demo-note--center">
              Demo payment only. No real money will be charged.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
