const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

// Read from Vite env in this demo app.
// Define VITE_TMDB_API_KEY in your client/.env.local file.
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

function buildUrl(path, params = {}) {
  const url = new URL(`${TMDB_BASE_URL}${path}`)

  if (API_KEY) {
    url.searchParams.set('api_key', API_KEY)
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  return url.toString()
}

export async function tmdbRequest(path, params) {
  if (!API_KEY) {
    throw new Error(
      'TMDB API key missing. Please set VITE_TMDB_API_KEY in client/.env.local',
    )
  }

  const url = buildUrl(path, params)
  const response = await fetch(url)

  if (!response.ok) {
    let message = response.statusText
    try {
      const data = await response.json()
      if (data.status_message) {
        message = data.status_message
      }
    } catch {
      // ignore JSON parse failures and use statusText
    }
    throw new Error(`TMDB error (${response.status}): ${message}`)
  }

  return response.json()
}

