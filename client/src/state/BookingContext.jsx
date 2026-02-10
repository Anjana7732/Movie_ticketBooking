import { createContext, useContext, useMemo, useState } from 'react'
import { clearAllBookings } from '../utils/storage.js'
import {
  addTicketToStorage,
  clearTicketsStorage,
  loadTickets,
} from '../utils/ticketStorage.js'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState('IN')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedTheater, setSelectedTheater] = useState(null)
  const [selectedShowtime, setSelectedShowtime] = useState('')
  const [selectedSeats, setSelectedSeats] = useState([])
  const [lastBooking, setLastBooking] = useState(null)
  const [tickets, setTickets] = useState(() => loadTickets())

  const value = useMemo(
    () => ({
      selectedMovie,
      setSelectedMovie,
      selectedCountry,
      setSelectedCountry,
      selectedCity,
      setSelectedCity,
      selectedTheater,
      setSelectedTheater,
      selectedShowtime,
      setSelectedShowtime,
      selectedSeats,
      setSelectedSeats,
      lastBooking,
      setLastBooking,
      tickets,
      addTicket: (ticketInput) => {
        const ticket = {
          id: `${Date.now()}`,
          ...ticketInput,
        }
        const updated = addTicketToStorage(ticket)
        setTickets(updated)
        return ticket
      },
      clearTickets: () => {
        clearTicketsStorage()
        setTickets([])
      },
      resetBookingFlow: () => {
        setSelectedCountry('IN')
        setSelectedCity('')
        setSelectedTheater(null)
        setSelectedShowtime('')
        setSelectedSeats([])
      },
      logout: () => {
        setSelectedMovie(null)
        setSelectedCountry('IN')
        setSelectedCity('')
        setSelectedTheater(null)
        setSelectedShowtime('')
        setSelectedSeats([])
        setLastBooking(null)
        clearAllBookings()
        clearTicketsStorage()
        setTickets([])
      },
    }),
    [
      selectedMovie,
      selectedCountry,
      selectedCity,
      selectedTheater,
      selectedShowtime,
      selectedSeats,
      lastBooking,
      tickets,
    ],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) {
    throw new Error('useBooking must be used inside BookingProvider')
  }
  return ctx
}

