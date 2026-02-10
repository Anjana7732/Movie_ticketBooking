import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../state/BookingContext.jsx'
import { formatCurrency } from '../utils/formatCurrency.js'
import { bookSeats } from '../api/client.js'
import { addBookedSeatsForKey } from '../utils/storage.js'
import { COUNTRIES } from '../config/countries.js'

export function CheckoutPage() {
  const navigate = useNavigate()
  const {
    selectedMovie,
    selectedCountry,
    selectedCity,
    selectedTheater,
    selectedShowtime,
    selectedSeats,
    setSelectedSeats,
    setLastBooking,
    addTicket,
  } = useBooking()

  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)

  const canCheckout =
    !!selectedMovie &&
    !!selectedCity &&
    !!selectedTheater &&
    !!selectedShowtime &&
    selectedSeats.length > 0

  useEffect(() => {
    if (!canCheckout) {
      navigate('/booking')
    }
  }, [canCheckout, navigate])

  const pricePerSeat = useMemo(
    () =>
      selectedMovie?.priceByCountry?.[selectedCountry] ??
      selectedMovie?.priceByCountry?.IN ??
      250,
    [selectedMovie, selectedCountry],
  )

  const totalPrice = pricePerSeat * (selectedSeats.length || 0)

  const bookingKey =
    selectedMovie && selectedCity && selectedTheater && selectedShowtime
      ? `${selectedMovie.id}__${selectedCity}__${selectedTheater.id}__${selectedShowtime}`
      : null

  const handleConfirm = async () => {
    if (!canCheckout || !bookingKey || submitting) return

    try {
      setSubmitting(true)
      setServerError(null)

      const response = await bookSeats({
        movieId: selectedMovie.id,
        city: selectedCity,
        theaterId: selectedTheater.id,
        showtime: selectedShowtime,
        seats: selectedSeats,
      })

      const serverBookedSeats =
        addBookedSeatsForKey(bookingKey, selectedSeats) ?? []

      const bookingId = `${Date.now()}`
      setLastBooking({
        id: bookingId,
        movie: selectedMovie,
        city: selectedCity,
        theater: selectedTheater,
        showtime: selectedShowtime,
        seats: selectedSeats,
        serverBookedSeats: response.bookedSeats ?? serverBookedSeats,
      })

      const ticket = {
        bookingId,
        movieId: selectedMovie.id,
        movieTitle: selectedMovie.title,
        moviePoster: selectedMovie.poster,
        city: selectedCity,
        theaterId: selectedTheater.id,
        theaterName: selectedTheater.name,
        showtime: selectedShowtime,
        seats: selectedSeats,
        bookingDate: new Date().toISOString(),
        countryCode: selectedCountry,
        pricePerSeat,
        totalPrice,
      }

      addTicket(ticket)
      setSelectedSeats([])
      navigate('/tickets')
    } catch (err) {
      setServerError(err.message || 'Failed to confirm booking')
    } finally {
      setSubmitting(false)
    }
  }

  if (!canCheckout || !selectedMovie) {
    return null
  }

  const countryLabel = COUNTRIES[selectedCountry]?.name ?? selectedCountry

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
          Step 3 · Checkout
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
          Review & confirm your booking
        </h1>
        <p className="text-xs text-slate-300 sm:text-sm">
          This is a demo checkout — no real payments are made, but your ticket
          will be saved to the mock ticket wallet.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/80 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.9)] sm:p-5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.25),_transparent_55%)]" />
            <div className="relative flex flex-col gap-4 sm:flex-row">
              <div className="w-full max-w-[120px] shrink-0 overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/80 shadow-[0_0_24px_rgba(129,140,248,0.8)]">
                <img
                  src={selectedMovie.poster}
                  alt={selectedMovie.title}
                  className="aspect-[2/3] w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-50 sm:text-lg">
                    {selectedMovie.title}
                  </h2>
                  <p className="mt-1 text-xs text-slate-300">
                    {selectedTheater?.name} · {selectedCity}
                  </p>
                </div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-200 sm:text-sm">
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      Country
                    </dt>
                    <dd className="font-medium">{countryLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      Showtime
                    </dt>
                    <dd className="font-medium">{selectedShowtime}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      Seats
                    </dt>
                    <dd className="font-medium">
                      {selectedSeats.length > 0
                        ? selectedSeats.join(', ')
                        : 'None'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      Tickets
                    </dt>
                    <dd className="font-medium">
                      {selectedSeats.length}{' '}
                      {selectedSeats.length === 1 ? 'seat' : 'seats'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-4 text-xs text-slate-200 shadow-sm shadow-black/50 sm:p-5 sm:text-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-100">
              Payment summary
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Price per ticket</span>
                <span className="font-medium">
                  {formatCurrency(pricePerSeat, selectedCountry)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  Tickets × {selectedSeats.length}
                </span>
                <span className="font-medium">
                  {formatCurrency(totalPrice, selectedCountry)}
                </span>
              </div>
              <div className="h-px bg-gradient-to-r from-slate-800 via-slate-700/60 to-slate-800" />
              <div className="flex items-center justify-between text-sm font-semibold text-slate-50">
                <span>Total payable</span>
                <span>{formatCurrency(totalPrice, selectedCountry)}</span>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              This app uses mock data only. Currency is shown in{' '}
              {COUNTRIES[selectedCountry]?.currencyCode ?? 'INR'} for realism,
              but no real transactions are processed.
            </p>
            {serverError && (
              <p className="mt-2 text-[11px] text-rose-300">{serverError}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/booking')}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-100 shadow-sm transition hover:border-violet-400"
            >
              Back to seats
            </button>
            <button
              type="button"
              disabled={!canCheckout || submitting}
              onClick={handleConfirm}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-50 shadow-[0_0_26px_rgba(139,92,246,0.9)] transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Confirming…' : 'Confirm booking'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

