const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SEATS_PER_ROW = 10;

const generateSeats = () => {
  const seats = [];

  ROWS.forEach((row) => {
    for (let number = 1; number <= SEATS_PER_ROW; number += 1) {
      seats.push({
        seatNumber: `${row}${number}`,
        status: 'available',
      });
    }
  });

  return seats;
};

module.exports = { generateSeats, ROWS, SEATS_PER_ROW };
