import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../state/BookingContext.jsx'
import { formatCurrency } from '../utils/formatCurrency.js'
import { addBookedSeatsForKey } from '../utils/storage.js'
import { COUNTRIES } from '../config/countries.js'

/* ────────────────────────────────────────────
   Payment method definitions
   ──────────────────────────────────────────── */

const PAYMENT_METHODS = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    icon: '💳',
    description: 'Visa, Mastercard, RuPay',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    icon: '🅿️',
    description: 'Pay with your PayPal account',
  },
  {
    id: 'esewa',
    label: 'eSewa',
    icon: '📱',
    description: 'Popular in Nepal',
  },
  {
    id: 'khalti',
    label: 'Khalti',
    icon: '📲',
    description: 'Popular in Nepal',
  },
  {
    id: 'cash',
    label: 'Cash on Counter',
    icon: '🏦',
    description: 'Pay at the theater',
  },
]

/* ────────────────────────────────────────────
   Initial form state & helpers
   ──────────────────────────────────────────── */

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  paymentMethod: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  paypalEmail: '',
}

function generateBookingId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = 'BK-'
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

/* ────────────────────────────────────────────
   Reusable sub-components (kept in same file
   for beginner-friendliness)
   ──────────────────────────────────────────── */

function TextField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  maxLength,
  disabled,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        disabled={disabled}
        className={`rounded-xl border bg-slate-900/80 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:ring-2 ${
          error
            ? 'border-rose-500/60 focus:ring-rose-500/40'
            : 'border-slate-700/80 focus:border-violet-500 focus:ring-violet-500/30'
        } disabled:cursor-not-allowed disabled:opacity-50`}
      />
      {error && <p className="text-[11px] text-rose-400">{error}</p>}
    </div>
  )
}

function PaymentMethodCard({
  method,
  selected,
  onSelect,
  disabled,
}) {
  const isActive = selected === method.id
  return (
    <button
      type="button"
      onClick={() => onSelect(method.id)}
      disabled={disabled}
      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
        isActive
          ? 'border-violet-500 bg-violet-500/10 shadow-[0_0_16px_rgba(139,92,246,0.2)]'
          : 'border-slate-700/80 bg-slate-900/60 hover:border-slate-600'
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-lg">
        {method.icon}
      </span>
      <div className="flex-1">
        <p
          className={`text-sm font-medium ${isActive ? 'text-violet-200' : 'text-slate-200'}`}
        >
          {method.label}
        </p>
        <p className="text-[11px] text-slate-400">{method.description}</p>
      </div>
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
          isActive
            ? 'border-violet-500 bg-violet-500'
            : 'border-slate-600 bg-transparent'
        }`}
      >
        {isActive && (
          <div className="h-2 w-2 rounded-full bg-white" />
        )}
      </div>
    </button>
  )
}

function Spinner() {
  return (
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
  )
}

function SuccessModal({ bookingId, onGoToTickets }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-4 flex w-full max-w-md flex-col items-center gap-5 rounded-3xl border border-emerald-500/30 bg-slate-950 p-8 shadow-[0_24px_80px_rgba(16,185,129,0.15)] animate-in">
        {/* Checkmark circle */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
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
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold text-slate-50">
            Payment Successful!
          </h2>
          <p className="text-sm text-slate-300">
            Your ticket has been booked. A confirmation has been saved to your
            ticket wallet.
          </p>
        </div>
        <div className="rounded-xl bg-slate-900/80 px-4 py-2.5 text-center">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Booking ID
          </p>
          <p className="mt-0.5 text-base font-bold tracking-wider text-emerald-300">
            {bookingId}
          </p>
        </div>
        <button
          type="button"
          onClick={onGoToTickets}
          className="w-full rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_26px_rgba(16,185,129,0.5)] transition hover:bg-emerald-400"
        >
          View My Tickets
        </button>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────
   Main CheckoutPage component
   ──────────────────────────────────────────── */

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

  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [processing, setProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [completedBookingId, setCompletedBookingId] = useState('')

  /* Redirect if data is missing */
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

  /* Computed values */
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

  const countryLabel = COUNTRIES[selectedCountry]?.name ?? selectedCountry
  const currencyCode = COUNTRIES[selectedCountry]?.currencyCode ?? 'INR'
  const todayDate = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  /* Form handlers */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for field being edited
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }, [])

  const handlePaymentMethodSelect = useCallback((methodId) => {
    setFormData((prev) => ({ ...prev, paymentMethod: methodId }))
    setErrors((prev) => {
      if (!prev.paymentMethod) return prev
      const next = { ...prev }
      delete next.paymentMethod
      return next
    })
  }, [])

  /* Validation */
  const validate = useCallback(() => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s-]{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid phone number'
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method'
    }

    // Conditional validation for card
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required'
      } else if (!/^[\d\s]{13,19}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Enter a valid card number'
      }

      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required'
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate.trim())) {
        newErrors.expiryDate = 'Use MM/YY format'
      }

      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV is required'
      } else if (!/^\d{3,4}$/.test(formData.cvv.trim())) {
        newErrors.cvv = 'Enter a valid CVV'
      }
    }

    // Conditional validation for PayPal
    if (formData.paymentMethod === 'paypal') {
      if (!formData.paypalEmail.trim()) {
        newErrors.paypalEmail = 'PayPal email is required'
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.paypalEmail.trim())
      ) {
        newErrors.paypalEmail = 'Enter a valid PayPal email'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  /* Submit / Simulate payment */
  const handleSubmit = useCallback(async () => {
    if (!canCheckout || !bookingKey || processing) return
    if (!validate()) return

    setProcessing(true)

    // Simulate payment processing delay (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mark seats as booked locally
    addBookedSeatsForKey(bookingKey, selectedSeats)

    const bookingId = generateBookingId()

    // Save to last booking for summary page
    setLastBooking({
      id: bookingId,
      movie: selectedMovie,
      city: selectedCity,
      theater: selectedTheater,
      showtime: selectedShowtime,
      seats: selectedSeats,
    })

    // Save ticket with enhanced data
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
      paymentMethod: formData.paymentMethod,
      customerName: formData.fullName.trim(),
      customerEmail: formData.email.trim(),
      customerPhone: formData.phone.trim(),
    }

    addTicket(ticket)
    setSelectedSeats([])
    setCompletedBookingId(bookingId)
    setProcessing(false)
    setShowSuccess(true)
  }, [
    canCheckout,
    bookingKey,
    processing,
    validate,
    selectedSeats,
    selectedMovie,
    selectedCity,
    selectedTheater,
    selectedShowtime,
    selectedCountry,
    pricePerSeat,
    totalPrice,
    formData,
    setLastBooking,
    addTicket,
    setSelectedSeats,
  ])

  const handleGoToTickets = useCallback(() => {
    setShowSuccess(false)
    navigate('/tickets')
  }, [navigate])

  /* Guard render */
  if (!canCheckout || !selectedMovie) {
    return null
  }

  /* Get the label for the selected payment method */
  const selectedMethodLabel =
    PAYMENT_METHODS.find((m) => m.id === formData.paymentMethod)?.label ?? ''

  return (
    <>
      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          bookingId={completedBookingId}
          onGoToTickets={handleGoToTickets}
        />
      )}

      <div className="flex w-full flex-col gap-6">
        {/* Page Header */}
        <header className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
            Step 3 · Checkout & Payment
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            Complete your booking
          </h1>
          <p className="text-xs text-slate-300 sm:text-sm">
            Review your booking details, fill in your information, and choose a
            payment method. This is a simulated checkout — no real payments are
            processed.
          </p>
        </header>

        {/* Two-column layout */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          {/* ─── LEFT SIDE: Booking Summary ─── */}
          <div className="flex flex-col gap-4">
            {/* Movie + Info Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.9)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.2),_transparent_55%)]" />
              <div className="relative flex flex-col gap-4 sm:flex-row">
                {/* Movie Poster */}
                <div className="w-full max-w-[130px] shrink-0 self-start overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/80 shadow-[0_0_24px_rgba(129,140,248,0.6)]">
                  <img
                    src={selectedMovie.poster}
                    alt={selectedMovie.title}
                    className="aspect-[2/3] w-full object-cover"
                  />
                </div>

                {/* Movie Details */}
                <div className="flex flex-1 flex-col gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-50 sm:text-lg">
                      {selectedMovie.title}
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      {selectedTheater?.name} · {selectedCity}
                    </p>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-5 gap-y-2.5 text-xs text-slate-200">
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Country
                      </dt>
                      <dd className="font-medium">{countryLabel}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Date
                      </dt>
                      <dd className="font-medium">{todayDate}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Showtime
                      </dt>
                      <dd className="font-medium">{selectedShowtime}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Seats
                      </dt>
                      <dd className="font-medium">
                        {selectedSeats.length > 0
                          ? selectedSeats.join(', ')
                          : 'None'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Tickets
                      </dt>
                      <dd className="font-medium">
                        {selectedSeats.length}{' '}
                        {selectedSeats.length === 1 ? 'ticket' : 'tickets'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Currency
                      </dt>
                      <dd className="font-medium">{currencyCode}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Price Breakdown Card */}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-sm shadow-black/50">
              <h3 className="mb-3 text-sm font-semibold text-slate-100">
                Price Breakdown
              </h3>
              <div className="space-y-2 text-sm text-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Price per ticket</span>
                  <span className="font-medium">
                    {formatCurrency(pricePerSeat, selectedCountry)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    Quantity × {selectedSeats.length}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(totalPrice, selectedCountry)}
                  </span>
                </div>
                <div className="h-px bg-gradient-to-r from-slate-800 via-slate-700/60 to-slate-800" />
                <div className="flex items-center justify-between text-base font-bold text-slate-50">
                  <span>Total</span>
                  <span className="text-violet-300">
                    {formatCurrency(totalPrice, selectedCountry)}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-slate-500">
                Prices are in{' '}
                {currencyCode} for demo
                purposes. No real transactions are made.
              </p>
            </div>

            {/* Back button (desktop) */}
            <button
              type="button"
              onClick={() => navigate('/booking')}
              className="hidden items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-100 shadow-sm transition hover:border-violet-400 lg:inline-flex"
            >
              ← Back to seat selection
            </button>
          </div>

          {/* ─── RIGHT SIDE: Payment Form ─── */}
          <div className="flex flex-col gap-4">
            {/* User Details */}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-sm shadow-black/50">
              <h3 className="mb-4 text-sm font-semibold text-slate-100">
                Your Details
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <TextField
                    label="Full Name"
                    name="fullName"
                    placeholder="e.g. Aarav Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                    disabled={processing}
                  />
                </div>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  disabled={processing}
                />
                <TextField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  disabled={processing}
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-sm shadow-black/50">
              <h3 className="mb-1 text-sm font-semibold text-slate-100">
                Payment Method
              </h3>
              <p className="mb-4 text-[11px] text-slate-400">
                Choose how you&apos;d like to pay
              </p>
              {errors.paymentMethod && (
                <p className="mb-3 text-[11px] text-rose-400">
                  {errors.paymentMethod}
                </p>
              )}
              <div className="grid gap-2.5 sm:grid-cols-2">
                {PAYMENT_METHODS.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    selected={formData.paymentMethod}
                    onSelect={handlePaymentMethodSelect}
                    disabled={processing}
                  />
                ))}
              </div>
            </div>

            {/* Conditional Payment Inputs */}
            {formData.paymentMethod === 'card' && (
              <div className="rounded-3xl border border-violet-500/20 bg-violet-950/10 p-5 shadow-sm shadow-black/50">
                <h3 className="mb-4 text-sm font-semibold text-slate-100">
                  Card Details
                </h3>
                <div className="grid gap-3">
                  <TextField
                    label="Card Number"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    error={errors.cardNumber}
                    maxLength={19}
                    disabled={processing}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <TextField
                      label="Expiry Date"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      error={errors.expiryDate}
                      maxLength={5}
                      disabled={processing}
                    />
                    <TextField
                      label="CVV"
                      name="cvv"
                      type="password"
                      placeholder="•••"
                      value={formData.cvv}
                      onChange={handleChange}
                      error={errors.cvv}
                      maxLength={4}
                      disabled={processing}
                    />
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-slate-500">
                  This is a simulated checkout. No card data is sent or stored.
                </p>
              </div>
            )}

            {formData.paymentMethod === 'paypal' && (
              <div className="rounded-3xl border border-violet-500/20 bg-violet-950/10 p-5 shadow-sm shadow-black/50">
                <h3 className="mb-4 text-sm font-semibold text-slate-100">
                  PayPal Details
                </h3>
                <TextField
                  label="PayPal Email"
                  name="paypalEmail"
                  type="email"
                  placeholder="your-paypal@email.com"
                  value={formData.paypalEmail}
                  onChange={handleChange}
                  error={errors.paypalEmail}
                  disabled={processing}
                />
                <p className="mt-3 text-[11px] text-slate-500">
                  You will be redirected to PayPal to complete the payment
                  (simulated).
                </p>
              </div>
            )}

            {formData.paymentMethod === 'esewa' && (
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-950/10 p-5 shadow-sm shadow-black/50">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-xl">
                    📱
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-100">
                      eSewa Payment
                    </p>
                    <p className="text-[11px] text-slate-400">
                      You will be redirected to eSewa to complete the payment of{' '}
                      <span className="font-semibold text-emerald-300">
                        {formatCurrency(totalPrice, selectedCountry)}
                      </span>{' '}
                      (simulated).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formData.paymentMethod === 'khalti' && (
              <div className="rounded-3xl border border-purple-500/20 bg-purple-950/10 p-5 shadow-sm shadow-black/50">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-xl">
                    📲
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-100">
                      Khalti Payment
                    </p>
                    <p className="text-[11px] text-slate-400">
                      You will be redirected to Khalti to complete the payment of{' '}
                      <span className="font-semibold text-purple-300">
                        {formatCurrency(totalPrice, selectedCountry)}
                      </span>{' '}
                      (simulated).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formData.paymentMethod === 'cash' && (
              <div className="rounded-3xl border border-amber-500/20 bg-amber-950/10 p-5 shadow-sm shadow-black/50">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-xl">
                    🏦
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-100">
                      Cash on Counter
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Your seats will be reserved. Please pay{' '}
                      <span className="font-semibold text-amber-300">
                        {formatCurrency(totalPrice, selectedCountry)}
                      </span>{' '}
                      at the theater counter before showtime.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/booking')}
                disabled={processing}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-100 shadow-sm transition hover:border-violet-400 disabled:cursor-not-allowed disabled:opacity-50 lg:hidden"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={handleSubmit}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-slate-50 shadow-[0_0_26px_rgba(139,92,246,0.7)] transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <Spinner />
                    <span>Processing payment…</span>
                  </>
                ) : (
                  <>
                    {selectedMethodLabel
                      ? `Pay ${formatCurrency(totalPrice, selectedCountry)} — ${selectedMethodLabel}`
                      : `Pay Now — ${formatCurrency(totalPrice, selectedCountry)}`}
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
