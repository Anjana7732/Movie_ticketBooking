const TICKETS_KEY = 'movie-ticket-my-tickets'

function getAllTickets() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(TICKETS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAllTickets(tickets) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets))
  } catch {
    // ignore storage errors in demo
  }
}

export function loadTickets() {
  return getAllTickets()
}

export function addTicketToStorage(ticket) {
  const existing = getAllTickets()
  const updated = [ticket, ...existing]
  saveAllTickets(updated)
  return updated
}

export function clearTicketsStorage() {
  saveAllTickets([])
}

