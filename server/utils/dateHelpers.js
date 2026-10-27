const pad = (value) => String(value).padStart(2, '0');

const toLocalDateString = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const addDaysToDateString = (offset) => {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
  return toLocalDateString(date);
};

const isShowtimeInPast = (showDate, startTime) => {
  const showDateTime = new Date(`${showDate}T${startTime}:00`);
  return Number.isNaN(showDateTime.getTime()) || showDateTime < new Date();
};

module.exports = { addDaysToDateString, isShowtimeInPast, toLocalDateString };
