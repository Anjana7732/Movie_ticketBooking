const STORAGE_KEY = 'movie-ticket-bookings'

function getAllBookings() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveAllBookings(all) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    // ignore
  }
}

export function getBookedSeatsForKey(key) {
  const all = getAllBookings()
  return all[key] ?? []
}

export function addBookedSeatsForKey(key, seats) {
  const all = getAllBookings()
  const existing = new Set(all[key] ?? [])
  for (const seat of seats) {
    existing.add(seat)
  }
  all[key] = Array.from(existing)
  saveAllBookings(all)
  return all[key]
}

export function clearAllBookings() {
  saveAllBookings({})
}


