export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const parseDateValue = (value) => {
  if (!value) return null;

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T12:00:00`);
  }

  return new Date(value);
};

export const formatDate = (value, options = {}) => {
  const date = parseDateValue(value);
  if (!date || Number.isNaN(date.getTime())) return 'Not available';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  });
};

export const formatShowDate = (value, options = {}) => {
  const date = parseDateValue(value);
  if (!date || Number.isNaN(date.getTime())) return value || 'Not available';

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...options,
  });
};

export const formatTime = (value = '') => {
  const [hourString, minuteString] = String(value).split(':');
  const hour = Number(hourString);
  const minute = Number(minuteString);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return value;

  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, '0')} ${suffix}`;
};

export const formatDuration = (minutes) => {
  const totalMinutes = Number(minutes) || 0;
  const hours = Math.floor(totalMinutes / 60);
  const remainder = totalMinutes % 60;

  if (hours === 0) return `${remainder}m`;
  if (remainder === 0) return `${hours}h`;
  return `${hours}h ${remainder}m`;
};

export const isShowtimePast = (showDate, startTime) => {
  if (!showDate || !startTime) return false;
  const showDateTime = new Date(`${showDate}T${startTime}:00`);
  return !Number.isNaN(showDateTime.getTime()) && showDateTime < new Date();
};

export const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U';

export const getBookingStatusLabel = (status) => {
  if (status === 'cancelled') return 'Cancelled';
  return 'Confirmed';
};

export const getPaymentStatusLabel = (status) => {
  if (status === 'refunded') return 'Refunded';
  if (status === 'pending') return 'Pending';
  return 'Paid (demo)';
};
