const API_BASE = '/api'

async function handleResponse(response) {
  if (!response.ok) {
    const message = await response
      .json()
      .catch(() => ({ message: 'Unknown error' }))
    throw new Error(message.message || 'Request failed')
  }
  return response.json()
}

export async function fetchMovies() {
  const res = await fetch(`${API_BASE}/movies`)
  const data = await handleResponse(res)
  return data.movies
}

export async function fetchMovieById(id) {
  const res = await fetch(`${API_BASE}/movies/${encodeURIComponent(id)}`)
  const data = await handleResponse(res)
  return data.movie
}

export async function fetchTheaters() {
  const res = await fetch(`${API_BASE}/theaters`)
  const data = await handleResponse(res)
  return data.theaters
}

export async function bookSeats(payload) {
  const res = await fetch(`${API_BASE}/book-seat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return handleResponse(res)
}

