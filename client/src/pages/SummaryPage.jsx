import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../state/BookingContext.jsx'

export function SummaryPage() {
  const navigate = useNavigate()
  const { lastBooking, resetBookingFlow, setSelectedMovie } = useBooking()

  useEffect(() => {
    if (!lastBooking) {
      navigate('/')
    }
  }, [lastBooking, navigate])

  if (!lastBooking) {
    return null
  }

  const { movie, city, theater, showtime, seats } = lastBooking

  const handleBookAnotherShow = () => {
    resetBookingFlow()
    setSelectedMovie(movie)
    navigate('/booking')
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="space-y-2 text-center sm:text-left">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-violet-300">
          Step 3 · Confirmation
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-violet-200 sm:text-3xl">
          Booking confirmed
        </h1>
        <p className="text-xs text-slate-300 sm:text-sm">
          Your demo ticket is reserved. No real payment or tickets are issued.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-3xl border border-violet-700/60 bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.95)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.35),_transparent_55%)]" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-full max-w-[140px] shrink-0 overflow-hidden rounded-2xl border border-violet-500/60 bg-slate-950/80 shadow-[0_0_30px_rgba(129,140,248,0.9)]">
              <img
                src={movie.poster}
                alt={movie.title}
                className="aspect-[2/3] w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-semibold text-slate-50 sm:text-lg">
                  {movie.title}
                </h2>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                  Confirmed
                </span>
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-200 sm:text-sm">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Cinema
                  </dt>
                  <dd className="font-medium">{theater.name}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    City
                  </dt>
                  <dd className="font-medium">{city}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Showtime
                  </dt>
                  <dd className="font-medium">{showtime}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Seats
                  </dt>
                  <dd className="font-medium">
                    {seats.length > 0 ? seats.join(', ') : '-'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 text-xs text-slate-200 shadow-sm shadow-black/50 sm:text-sm">
            <p className="font-semibold text-slate-100">Demo environment only</p>
            <p className="mt-2 text-slate-300">
              This booking flow is for demonstration purposes. It showcases
              multi-step navigation, seat selection with availability, and
              confirmation UI, but does not process real payments or issue
              tickets.
            </p>
            <p className="mt-2 text-slate-300">
              Ticket prices are simulated and vary by country (₹ for India, NPR
              for Nepal) to make the experience feel more realistic.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleBookAnotherShow}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-50 shadow-[0_0_26px_rgba(139,92,246,0.9)] transition hover:bg-violet-400"
            >
              Book another show
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-100 shadow-sm transition hover:border-violet-400"
            >
              Back to home
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

