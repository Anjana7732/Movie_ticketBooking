import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../state/BookingContext.jsx'
import { formatCurrency } from '../utils/formatCurrency.js'
import { COUNTRIES } from '../config/countries.js'

const PAYMENT_ICONS = {
  card: '💳',
  paypal: '🅿️',
  esewa: '📱',
  khalti: '📲',
  cash: '🏦',
}

const PAYMENT_LABELS = {
  card: 'Credit / Debit Card',
  paypal: 'PayPal',
  esewa: 'eSewa',
  khalti: 'Khalti',
  cash: 'Cash on Counter',
}

/* ────────────────────────────────────────────
   Dashed divider for receipt feel
   ──────────────────────────────────────────── */
function DashedDivider() {
  return (
    <div className="flex items-center gap-1 py-2">
      {Array.from({ length: 40 }).map((_, i) => (
        <span
          key={i}
          className="h-px flex-1 bg-slate-700/70"
        />
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────
   Receipt line item
   ──────────────────────────────────────────── */
function ReceiptRow({ label, value, bold, highlight }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <span className="text-slate-400">{label}</span>
      <span
        className={`text-right ${
          bold
            ? 'text-base font-bold'
            : 'font-medium'
        } ${highlight ? 'text-emerald-300' : 'text-slate-100'}`}
      >
        {value}
      </span>
    </div>
  )
}

/* ────────────────────────────────────────────
   Main ConfirmationPage
   ──────────────────────────────────────────── */
export function ConfirmationPage() {
  const navigate = useNavigate()
  const {
    lastConfirmedTicket,
    setLastConfirmedTicket,
    resetBookingFlow,
    setSelectedMovie,
  } = useBooking()

  useEffect(() => {
    if (!lastConfirmedTicket) {
      navigate('/')
    }
  }, [lastConfirmedTicket, navigate])

  const handleViewTickets = useCallback(() => {
    navigate('/tickets')
  }, [navigate])

  const handleBookAnother = useCallback(() => {
    resetBookingFlow()
    if (lastConfirmedTicket?.movie) {
      setSelectedMovie(lastConfirmedTicket.movie)
    }
    navigate('/booking')
  }, [navigate, resetBookingFlow, setSelectedMovie, lastConfirmedTicket])

  const handleGoHome = useCallback(() => {
    navigate('/')
  }, [navigate])

  if (!lastConfirmedTicket) {
    return null
  }

  const {
    bookingId,
    movieTitle,
    moviePoster,
    theaterName,
    city,
    showtime,
    seats,
    pricePerSeat,
    totalPrice,
    paymentMethod,
    customerName,
    customerEmail,
    customerPhone,
    countryCode,
    bookingDate,
  } = lastConfirmedTicket

  const countryLabel = COUNTRIES[countryCode]?.name ?? countryCode
  const currencyCode = COUNTRIES[countryCode]?.currencyCode ?? 'INR'
  const paymentLabel = PAYMENT_LABELS[paymentMethod] ?? paymentMethod ?? '-'
  const paymentIcon = PAYMENT_ICONS[paymentMethod] ?? '💰'
  const seatCount = seats?.length ?? 0

  const bookingDateFormatted = bookingDate
    ? new Date(bookingDate).toLocaleString(undefined, {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleString()

  return (
    <div className="flex w-full flex-col items-center gap-6 py-4">
      {/* ─── Success Header ─── */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 shadow-[0_0_50px_rgba(16,185,129,0.35)]">
          <svg
            className="h-10 w-10 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          {/* Animated rings */}
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/10" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
            Bill Paid Successfully
          </h1>
          <p className="text-sm text-slate-300">
            Your booking is confirmed. Here is your receipt.
          </p>
        </div>
      </div>

      {/* ─── Receipt Card ─── */}
      <div className="w-full max-w-lg">
        <div className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
          {/* Top decorative strip */}
          <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />

          {/* Receipt content */}
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            {/* ─── PAID stamp + Booking ID ─── */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
                  Booking Reference
                </p>
                <p className="mt-0.5 text-lg font-bold tracking-wider text-emerald-300">
                  {bookingId}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-400">
                  PAID
                </span>
              </div>
            </div>

            <DashedDivider />

            {/* ─── Movie info with poster ─── */}
            <div className="flex gap-4">
              <div className="w-20 shrink-0 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/80 shadow-[0_0_16px_rgba(16,185,129,0.3)]">
                <img
                  src={moviePoster}
                  alt={movieTitle}
                  className="aspect-[2/3] w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-1">
                <h2 className="text-base font-semibold text-slate-50 sm:text-lg">
                  {movieTitle}
                </h2>
                <p className="text-xs text-slate-400">
                  {theaterName} · {city}
                </p>
                <p className="text-xs text-slate-500">{countryLabel}</p>
              </div>
            </div>

            <DashedDivider />

            {/* ─── Booking Details ─── */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Booking Details
              </p>
              <ReceiptRow label="Date & Time" value={bookingDateFormatted} />
              <ReceiptRow label="Showtime" value={showtime} />
              <ReceiptRow
                label="Seats"
                value={
                  seats && seats.length > 0 ? seats.join(', ') : '-'
                }
              />
              <ReceiptRow
                label="No. of Tickets"
                value={`${seatCount} ${seatCount === 1 ? 'ticket' : 'tickets'}`}
              />
            </div>

            <DashedDivider />

            {/* ─── Price Breakdown ─── */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Price Breakdown
              </p>
              <ReceiptRow
                label="Price per ticket"
                value={formatCurrency(pricePerSeat, countryCode)}
              />
              <ReceiptRow
                label={`Quantity × ${seatCount}`}
                value={formatCurrency(totalPrice, countryCode)}
              />
              <div className="my-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
              <ReceiptRow
                label="Total Paid"
                value={formatCurrency(totalPrice, countryCode)}
                bold
                highlight
              />
              <ReceiptRow label="Currency" value={currencyCode} />
            </div>

            <DashedDivider />

            {/* ─── Payment Method ─── */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Payment
              </p>
              <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 px-4 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/60 text-lg">
                  {paymentIcon}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-100">
                    {paymentLabel}
                  </p>
                  <p className="text-[11px] text-emerald-400">
                    Payment completed
                  </p>
                </div>
              </div>
            </div>

            <DashedDivider />

            {/* ─── Customer Info ─── */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Customer
              </p>
              <ReceiptRow label="Name" value={customerName ?? '-'} />
              <ReceiptRow label="Email" value={customerEmail ?? '-'} />
              <ReceiptRow label="Phone" value={customerPhone ?? '-'} />
            </div>

            <DashedDivider />

            {/* ─── Footer / Thank you ─── */}
            <div className="flex flex-col items-center gap-2 pt-2 text-center">
              <div className="flex items-center gap-2 text-emerald-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-semibold">
                  Transaction Successful
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Thank you for your booking! Enjoy the movie.
              </p>
              <p className="text-[10px] text-slate-600">
                This is a simulated receipt — no real payment was processed.
              </p>
            </div>
          </div>

          {/* Bottom decorative strip */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />
        </div>
      </div>

      {/* ─── Action Buttons ─── */}
      <div className="flex w-full max-w-lg flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleViewTickets}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_26px_rgba(16,185,129,0.5)] transition hover:bg-emerald-400"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
            />
          </svg>
          View My Tickets
        </button>
        <button
          type="button"
          onClick={handleBookAnother}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-slate-50 shadow-[0_0_26px_rgba(139,92,246,0.6)] transition hover:bg-violet-400"
        >
          Book Another Show
        </button>
        <button
          type="button"
          onClick={handleGoHome}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-100 shadow-sm transition hover:border-violet-400"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
