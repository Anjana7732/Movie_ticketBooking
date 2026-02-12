import { Link } from 'react-router-dom'
import { useBooking } from '../state/BookingContext.jsx'
import { formatCurrency } from '../utils/formatCurrency.js'

const PAYMENT_LABELS = {
  card: 'Credit / Debit Card',
  paypal: 'PayPal',
  esewa: 'eSewa',
  khalti: 'Khalti',
  cash: 'Cash on Counter',
}

function getPaymentLabel(method) {
  return PAYMENT_LABELS[method] ?? method ?? '-'
}

export function MyTicketsPage() {
  const { tickets } = useBooking()

  if (!tickets || tickets.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-3xl">
          🎟️
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-slate-50 sm:text-xl">
            No tickets yet
          </h1>
          <p className="max-w-md text-xs text-slate-300 sm:text-sm">
            Your booked tickets will appear here. Start by exploring movies on
            the home page and completing a booking through the demo checkout
            flow.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-violet-500 px-5 py-2 text-sm font-semibold text-slate-50 shadow-[0_0_26px_rgba(139,92,246,0.9)] transition hover:bg-violet-400"
        >
          Browse movies
        </Link>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <header className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
          Your tickets
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
          My Tickets
        </h1>
        <p className="text-xs text-slate-300 sm:text-sm">
          These tickets are stored locally in your browser for this demo. You
          can safely refresh the page and they will still be here.
        </p>
      </header>

      <section className="space-y-3">
        <p className="text-xs text-slate-400 sm:text-sm">
          Showing <span className="font-semibold text-slate-200">{tickets.length}</span>{' '}
          {tickets.length === 1 ? 'booking' : 'bookings'}.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {tickets.map((ticket) => {
            const bookingDate = ticket.bookingDate
              ? new Date(ticket.bookingDate)
              : null
            const bookingDateLabel = bookingDate
              ? bookingDate.toLocaleString(undefined, {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recently booked'

            return (
              <article
                key={ticket.id || ticket.bookingId}
                className="flex overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-[0_18px_40px_rgba(15,23,42,0.85)]"
              >
                <div className="hidden w-32 shrink-0 overflow-hidden border-r border-slate-800/80 bg-slate-900/80 sm:block">
                  <img
                    src={ticket.moviePoster}
                    alt={ticket.movieTitle}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <header className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-50 sm:text-base">
                        {ticket.movieTitle}
                      </h2>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {ticket.theaterName} · {ticket.city}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                      Confirmed
                    </span>
                  </header>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-slate-200 sm:text-xs">
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        Booking ID
                      </dt>
                      <dd className="font-semibold tracking-wide text-violet-300">
                        {ticket.bookingId ?? '-'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        Date & Time
                      </dt>
                      <dd className="font-medium">{bookingDateLabel}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        Show Time
                      </dt>
                      <dd className="font-medium">{ticket.showtime}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        Seats
                      </dt>
                      <dd className="font-medium">
                        {ticket.seats && ticket.seats.length > 0
                          ? ticket.seats.join(', ')
                          : '-'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        Payment Method
                      </dt>
                      <dd className="font-medium">
                        {getPaymentLabel(ticket.paymentMethod)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        Total Price
                      </dt>
                      <dd className="font-semibold text-emerald-300">
                        {formatCurrency(
                          ticket.totalPrice ?? 0,
                          ticket.countryCode ?? 'IN',
                        )}
                      </dd>
                    </div>
                  </dl>
                  {/* Customer info row */}
                  {ticket.customerName && (
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-800/60 pt-2 text-[10px] text-slate-400">
                      <span>
                        Booked by{' '}
                        <span className="font-medium text-slate-300">
                          {ticket.customerName}
                        </span>
                      </span>
                      {ticket.customerEmail && (
                        <span>· {ticket.customerEmail}</span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}

