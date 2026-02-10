// Movie sources:
// - A real public API (TVMaze) for realistic posters and data.
// - Additional mocked "APIs" with different shapes to demonstrate normalization.

import fetch from 'node-fetch';

const tmdbLikeMovies = [
  {
    id: 1,
    title: 'The Galactic Odyssey',
    // Use a reliable dummy image instead of a fake TMDB path
    poster_path:
      'https://dummyimage.com/400x600/020617/38bdf8&text=The+Galactic+Odyssey',
    genre_ids: ['Science Fiction', 'Adventure'],
    runtime: 132,
    vote_average: 8.4,
    overview:
      'A crew of explorers travel through a newly discovered wormhole, facing the edges of space and time.',
  },
  {
    id: 2,
    title: 'Midnight Heist',
    poster_path:
      'https://dummyimage.com/400x600/020617/f97316&text=Midnight+Heist',
    genre_ids: ['Action', 'Thriller'],
    runtime: 108,
    vote_average: 7.6,
    overview:
      'A team of expert thieves plan the ultimate museum robbery on the night of a once-in-a-lifetime storm.',
  },
  {
    id: 3,
    title: 'Laugh Till Monday',
    poster_path:
      'https://dummyimage.com/400x600/020617/22c55e&text=Laugh+Till+Monday',
    genre_ids: ['Comedy', 'Romance'],
    runtime: 101,
    vote_average: 7.2,
    overview:
      'Two strangers stuck in an airport over the weekend form an unlikely bond over a series of comic mishaps.',
  },
];

const publicJsonApiMovies = [
  {
    movie_id: 'A-100',
    name: 'Hidden Frequencies',
    poster:
      'https://dummyimage.com/400x600/1e293b/ffffff&text=Hidden+Frequencies',
    category: 'Mystery, Drama',
    length_minutes: 118,
    rating: 8.1,
    description:
      'A sound engineer discovers a pattern in random radio noise that could expose a global conspiracy.',
  },
  {
    movie_id: 'A-101',
    name: 'City of Echoes',
    poster: 'https://dummyimage.com/400x600/0f766e/ffffff&text=City+of+Echoes',
    category: 'Drama',
    length_minutes: 124,
    rating: 8.7,
    description:
      'Four strangers in a bustling metropolis discover their lives are more connected than they imagined.',
  },
  {
    movie_id: 'A-102',
    name: 'Pixel Raiders',
    poster: 'https://dummyimage.com/400x600/b91c1c/ffffff&text=Pixel+Raiders',
    category: 'Action, Sci-Fi',
    length_minutes: 110,
    rating: 7.9,
    description:
      'Professional gamers are recruited to pilot experimental drones in a real-world defense mission.',
  },
];

const extraStaticMovies = [
  {
    id: 'EX-201',
    title: 'Silent Horizon',
    poster: 'https://dummyimage.com/400x600/111827/ffffff&text=Silent+Horizon',
    genre: ['Drama', 'Sci-Fi'],
    duration: 130,
    rating: 8.3,
    description:
      'An astronaut stranded on a distant moon must decide between survival and saving a colony on Earth.',
  },
  {
    id: 'EX-202',
    title: 'Rhythm & Rust',
    poster: 'https://dummyimage.com/400x600/4b5563/ffffff&text=Rhythm+%26+Rust',
    genre: ['Musical', 'Drama'],
    duration: 119,
    rating: 7.8,
    description:
      'A washed-up rockstar and a street drummer team up to save a legendary music venue.',
  },
];

function normalizeFromTmdb(movie) {
  return {
    id: `tmdb-${movie.id}`,
    title: movie.title,
    poster: movie.poster_path,
    genre: movie.genre_ids,
    duration: movie.runtime,
    rating: movie.vote_average,
    description: movie.overview,
  };
}

function normalizeFromPublicJson(movie) {
  return {
    id: `public-${movie.movie_id}`,
    title: movie.name,
    poster: movie.poster,
    genre: movie.category.split(',').map((g) => g.trim()),
    duration: movie.length_minutes,
    rating: movie.rating,
    description: movie.description,
  };
}

function normalizeFromStatic(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster: movie.poster,
    genre: movie.genre,
    duration: movie.duration,
    rating: movie.rating,
    description: movie.description,
  };
}

function normalizeFromTvMaze(show) {
  const image =
    (show.image && (show.image.medium || show.image.original)) ||
    'https://dummyimage.com/400x600/020617/e5e7eb&text=No+Image';

  const cleanSummary = show.summary
    ? show.summary.replace(/<[^>]+>/g, '')
    : 'No description available.';

  return {
    id: `tvmaze-${show.id}`,
    title: show.name,
    poster: image,
    genre: Array.isArray(show.genres) && show.genres.length > 0
      ? show.genres
      : ['Drama'],
    duration: show.runtime || 90,
    rating:
      (show.rating && typeof show.rating.average === 'number'
        ? show.rating.average
        : 7.0),
    description: cleanSummary,
  };
}

async function fetchTvMazeShows(limit = 8) {
  const res = await fetch('https://api.tvmaze.com/shows?page=1');
  if (!res.ok) {
    throw new Error(`TVMaze API error: ${res.status}`);
  }
  const data = await res.json();
  return data.slice(0, limit).map(normalizeFromTvMaze);
}

export async function getNormalizedMovies() {
  const all = [];

  // 1. Try to fetch from a real public API (TVMaze) for realistic posters.
  try {
    const tvMaze = await fetchTvMazeShows(10);
    all.push(...tvMaze);
  } catch (error) {
    console.error('Failed to fetch from TVMaze API, falling back to static data', error);
  }

  // 2. If the public API is unavailable (e.g., offline), fall back to our
  //    in-memory mocked "APIs" so the app always has data.
  if (all.length === 0) {
    const tmdbNormalized = tmdbLikeMovies.map(normalizeFromTmdb);
    const publicNormalized = publicJsonApiMovies.map(normalizeFromPublicJson);
    const staticNormalized = extraStaticMovies.map(normalizeFromStatic);

    all.push(...tmdbNormalized, ...publicNormalized, ...staticNormalized);
  }

  // Deduplicate by id just in case
  const unique = new Map();
  for (const movie of all) {
    unique.set(movie.id, movie);
  }

  return Array.from(unique.values());
}

