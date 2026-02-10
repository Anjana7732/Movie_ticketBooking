// Simple in-memory store to simulate seat booking persistence on the server.
// The client is still responsible for persisting bookings in localStorage.

export function createBookingStore() {
  // Map<bookingKey, Set<seatId>>
  const bookings = new Map();

  function bookSeats(bookingKey, seats) {
    if (!bookings.has(bookingKey)) {
      bookings.set(bookingKey, new Set());
    }

    const bookedSet = bookings.get(bookingKey);
    const conflictingSeats = seats.filter((seat) => bookedSet.has(seat));

    if (conflictingSeats.length > 0) {
      return {
        success: false,
        conflictingSeats,
        bookedSeats: Array.from(bookedSet),
      };
    }

    for (const seat of seats) {
      bookedSet.add(seat);
    }

    return {
      success: true,
      conflictingSeats: [],
      bookedSeats: Array.from(bookedSet),
    };
  }

  return {
    bookSeats,
  };
}

