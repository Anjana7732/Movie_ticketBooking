const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

export function mapTmdbMovie(movie, { defaultCountry = 'IN' } = {}) {
  const rawLang = movie.original_language || 'en'

  let languageLabel = 'Other'
  if (rawLang === 'hi') languageLabel = 'Hindi'
  else if (rawLang === 'en') languageLabel = 'English'
  else if (rawLang === 'ne') languageLabel = 'Nepali'

  return {
    // Encode source in the id so we can look up later
    id: `tmdb-${movie.id}`,
    title: movie.title || movie.name || 'Untitled',
    poster: movie.poster_path
      ? `${POSTER_BASE}${movie.poster_path}`
      : 'https://dummyimage.com/400x600/020617/e5e7eb&text=No+Image',
    genre:
      Array.isArray(movie.genre_names) && movie.genre_names.length > 0
        ? movie.genre_names
        : [],
    duration: movie.runtime || movie.runtime_minutes || 120,
    rating:
      typeof movie.vote_average === 'number' && movie.vote_average > 0
        ? movie.vote_average
        : 7.0,
    description: movie.overview || 'No description available.',
    language: rawLang,
    languageLabel,
    country: defaultCountry,
    priceByCountry: {
      IN: 250,
      NP: 400,
    },
  }
}

