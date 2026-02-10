import { NEPALI_MOVIES } from '../mocks/nepaliMovies.js'

export const MOVIE_CATEGORIES = {
  BOLLYWOOD: 'bollywood',
  HOLLYWOOD: 'hollywood',
  NEPALI: 'nepali',
  TRENDING: 'trending',
  UPCOMING: 'upcoming',
}

const SAMPLEAPIS_BASE = 'https://api.sampleapis.com/movies'

// Small local mock list for Bollywood so the category
// always shows appropriate Hindi/Indian-style movies
// regardless of any changes to public demo APIs.
const BOLLYWOOD_MOVIES = [
  {
    id: 'in-001',
    title: 'Mumbai Nights',
    poster:
      'https://dummyimage.com/400x600/020617/f97316&text=Mumbai+Nights',
    genre: ['Romance', 'Drama'],
    duration: 138,
    rating: 8.2,
    description:
      'A heartfelt love story set against the bustling backdrop of Mumbai, following two strangers whose lives keep intersecting.',
    language: 'hi',
    languageLabel: 'Hindi',
    country: 'IN',
    priceByCountry: {
      IN: 260,
      NP: 420,
    },
  },
  {
    id: 'in-002',
    title: 'Delhi Chase',
    poster:
      'https://dummyimage.com/400x600/020617/22c55e&text=Delhi+Chase',
    genre: ['Action', 'Thriller'],
    duration: 132,
    rating: 7.8,
    description:
      'An action-packed thriller where an honest officer fights a powerful crime syndicate across the streets of Delhi.',
    language: 'hi',
    languageLabel: 'Hindi',
    country: 'IN',
    priceByCountry: {
      IN: 270,
      NP: 430,
    },
  },
  {
    id: 'in-003',
    title: 'Monsoon Melodies',
    poster:
      'https://dummyimage.com/400x600/020617/fbbf24&text=Monsoon+Melodies',
    genre: ['Musical', 'Romance'],
    duration: 145,
    rating: 7.5,
    description:
      'A musical romance following aspiring singers who meet during the monsoon season and chase their dreams together.',
    language: 'hi',
    languageLabel: 'Hindi',
    country: 'IN',
    priceByCountry: {
      IN: 250,
      NP: 410,
    },
  },
  {
    id: 'in-004',
    title: 'Chennai Express Lane',
    poster:
      'https://dummyimage.com/400x600/020617/3b82f6&text=Chennai+Express+Lane',
    genre: ['Comedy', 'Adventure'],
    duration: 130,
    rating: 7.9,
    description:
      'A light-hearted comedy adventure about an unlikely group of travellers on a chaotic train journey to Chennai.',
    language: 'hi',
    languageLabel: 'Hindi',
    country: 'IN',
    priceByCountry: {
      IN: 240,
      NP: 400,
    },
  },
]

async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch movies from ${url} (${response.status})`)
  }
  return response.json()
}

function asArray(data) {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object') {
    if (Array.isArray(data.items)) return data.items
    if (Array.isArray(data.results)) return data.results
    return Object.values(data)
  }
  return []
}

function normalizeSampleMovie(movie, { listKey, language, languageLabel }) {
  const poster =
    movie.posterURL ||
    movie.posterUrl ||
    movie.poster ||
    movie.imageURL ||
    'https://dummyimage.com/400x600/020617/e5e7eb&text=No+Image'

  const rawGenres =
    movie.genres ||
    movie.genre ||
    movie.categories ||
    movie.category ||
    ''

  const genres = Array.isArray(rawGenres)
    ? rawGenres
    : String(rawGenres)
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean)

  const rating =
    typeof movie.imdbRating === 'number'
      ? movie.imdbRating
      : typeof movie.rating === 'number'
      ? movie.rating
      : 7

  const description =
    movie.plot || movie.overview || movie.description || 'No description.'

  return {
    id: `sa|${listKey}|${movie.id}`,
    title: movie.title || movie.name || 'Untitled',
    poster,
    genre: genres,
    duration: movie.runtime || movie.length || movie.duration || 120,
    rating,
    description,
    language,
    languageLabel,
    country: 'IN',
    priceByCountry: {
      IN: 260,
      NP: 420,
    },
  }
}

// Use different SampleAPIs lists to simulate categories.
export async function getTrendingMovies() {
  const listKey = 'comedy'
  const data = await fetchJson(`${SAMPLEAPIS_BASE}/${listKey}`)
  const list = asArray(data)
  return list.slice(0, 18).map((m) =>
    normalizeSampleMovie(m, {
      listKey,
      language: 'en',
      languageLabel: 'English',
    }),
  )
}

export async function getUpcomingMovies() {
  const listKey = 'scifi-fantasy'
  const data = await fetchJson(`${SAMPLEAPIS_BASE}/${listKey}`)
  const list = asArray(data)
  return list.slice(0, 18).map((m) =>
    normalizeSampleMovie(m, {
      listKey,
      language: 'en',
      languageLabel: 'English',
    }),
  )
}

export async function getBollywoodMovies() {
  // Use local mock data to ensure Bollywood always shows
  // appropriate Hindi/Indian-style titles rather than
  // depending on a generic public API list.
  return BOLLYWOOD_MOVIES
}

export async function getHollywoodMovies() {
  const listKey = 'action-adventure'
  const data = await fetchJson(`${SAMPLEAPIS_BASE}/${listKey}`)
  const list = asArray(data)
  return list.slice(0, 18).map((m) =>
    normalizeSampleMovie(m, {
      listKey,
      language: 'en',
      languageLabel: 'English',
    }),
  )
}

export async function getNepaliMovies() {
  // Already in normalized app shape
  return NEPALI_MOVIES
}

export async function getMoviesByCategory(category) {
  switch (category) {
    case MOVIE_CATEGORIES.BOLLYWOOD:
      return getBollywoodMovies()
    case MOVIE_CATEGORIES.HOLLYWOOD:
      return getHollywoodMovies()
    case MOVIE_CATEGORIES.NEPALI:
      return getNepaliMovies()
    case MOVIE_CATEGORIES.UPCOMING:
      return getUpcomingMovies()
    case MOVIE_CATEGORIES.TRENDING:
    default:
      return getTrendingMovies()
  }
}

export async function getMovieByGlobalId(globalId) {
  if (globalId.startsWith('np-')) {
    const movie = NEPALI_MOVIES.find((m) => m.id === globalId)
    if (!movie) {
      throw new Error('Nepali movie not found')
    }
    return movie
  }

  if (globalId.startsWith('sa|')) {
    const [, listKey, originalId] = globalId.split('|')
    if (!listKey || !originalId) {
      throw new Error('Invalid movie id format')
    }
    const data = await fetchJson(`${SAMPLEAPIS_BASE}/${listKey}`)
    const list = asArray(data)
    const found = list.find((m) => String(m.id) === String(originalId))
    if (!found) throw new Error('Movie not found')

    // Match language/label to list.
    const isBollywoodList = listKey === 'drama'
    return normalizeSampleMovie(found, {
      listKey,
      language: isBollywoodList ? 'hi' : 'en',
      languageLabel: isBollywoodList ? 'Hindi' : 'English',
    })
  }

  throw new Error('Unknown movie id format')
}

