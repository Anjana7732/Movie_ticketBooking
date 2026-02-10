
import express from 'express';
import cors from 'cors';

import { getNormalizedMovies } from './movies.js';
import { getTheaters } from './theaters.js';
import { createBookingStore } from './store.js';

const app = express();
const PORT = process.env.PORT || 4000;

const bookingStore = createBookingStore();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'movie-ticket-booking-api' });
});

// GET /movies → Fetch & normalize movies from multiple (mocked) APIs
app.get('/movies', async (req, res) => {
  try {
    const movies = await getNormalizedMovies();
    res.json({ movies });
  } catch (error) {
    console.error('Error fetching movies', error);
    res.status(500).json({ message: 'Failed to fetch movies' });
  }
});

// GET /movies/:id → Fetch a single movie by id
app.get('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const movies = await getNormalizedMovies();
    const movie = movies.find((m) => String(m.id) === String(id));

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ movie });
  } catch (error) {
    console.error('Error fetching movie by id', error);
    res.status(500).json({ message: 'Failed to fetch movie' });
  }
});

// GET /theaters → Return dummy theater & showtime data
app.get('/theaters', (req, res) => {
  const theaters = getTheaters();
  res.json({ theaters });
});

// POST /book-seat → Simulate seat booking logic
app.post('/book-seat', (req, res) => {
  const { movieId, city, theaterId, showtime, seats } = req.body || {};

  if (!movieId || !city || !theaterId || !showtime || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: 'Missing required booking fields' });
  }

  try {
    const bookingKey = `${movieId}__${city}__${theaterId}__${showtime}`;
    const result = bookingStore.bookSeats(bookingKey, seats);

    if (!result.success) {
      return res.status(409).json({
        message: 'Some seats are already booked',
        conflictingSeats: result.conflictingSeats,
        bookedSeats: result.bookedSeats,
      });
    }

    res.status(201).json({
      message: 'Booking confirmed',
      bookedSeats: result.bookedSeats,
    });
  } catch (error) {
    console.error('Error booking seats', error);
    res.status(500).json({ message: 'Failed to book seats' });
  }
});

app.listen(PORT, () => {
  console.log(`Movie ticket booking API listening on http://localhost:${PORT}`);
});

