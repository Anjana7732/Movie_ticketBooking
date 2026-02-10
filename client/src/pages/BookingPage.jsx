import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchTheaters } from '../api/client.js'
import { LoadingState, ErrorState } from '../components/Feedback.jsx'
import { SelectField, InfoChip } from '../components/Selectors.jsx'
import { SeatGrid, buildSeatId } from '../components/SeatGrid.jsx'
import { useBooking } from '../state/BookingContext.jsx'
import { COUNTRIES } from '../config/countries.js'
import { formatCurrency } from '../utils/formatCurrency.js'
import { getBookedSeatsForKey } from '../utils/storage.js'

const NEPAL_SHOWTIMES = ['10:15 AM', '1:45 PM', '5:15 PM', '8:45 PM']

const NEPAL_THEATERS_BY_CITY = {
  Kathmandu: [
    {
      id: 'np-kath-qfx-civil',
      name: 'QFX Cinemas - Civil Mall',
      address: 'Sundhara, Kathmandu',
      showtimes: NEPAL_SHOWTIMES,
    },
    {
      id: 'np-kath-qfx-labim',
      name: 'QFX Cinemas - Labim Mall',
      address: 'Pulchowk, Lalitpur (Kathmandu Valley)',
      showtimes: NEPAL_SHOWTIMES,
    },
  ],
  Pokhara: [
    {
      id: 'np-pok-qfx-lakecity',
      name: 'QFX Lake City',
      address: 'Chipledhunga, Pokhara',
      showtimes: NEPAL_SHOWTIMES,
    },
  ],
  Lalitpur: [
    {
      id: 'np-lalit-bq-cinema',
      name: 'Big Movies - City Center',
      address: 'Kamal Pokhari, Kathmandu (Lalitpur nearby)',
      showtimes: NEPAL_SHOWTIMES,
    },
  ],
}

export function BookingPage() {
  const navigate = useNavigate()
  const {
    selectedMovie,
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
    setLastBooking,
  } = useBooking()

  const [theatersData, setTheatersData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!selectedMovie) {
      navigate('/')
    }
  }, [selectedMovie, navigate])

  const loadTheaters = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchTheaters()
      setTheatersData(data)
    } catch (err) {
      setError(err.message || 'Failed to load theaters')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTheaters()
  }, [])

  const cities = useMemo(
    () => {
      const config = COUNTRIES[selectedCountry]
      return config ? config.cities : []
    },
    [selectedCountry],
  )

  const theatersForCity = useMemo(() => {
    const cityFromApi = theatersData.find((c) => c.city === selectedCity)
    if (cityFromApi) {
      return cityFromApi.theaters ?? []
    }
    const nepalTheaters = NEPAL_THEATERS_BY_CITY[selectedCity]
    return nepalTheaters ?? []
  }, [theatersData, selectedCity])

  const showtimesForTheater = useMemo(
    () => selectedTheater?.showtimes ?? [],
    [selectedTheater],
  )

  const bookingKey =
    selectedMovie && selectedCity && selectedTheater && selectedShowtime
      ? `${selectedMovie.id}__${selectedCity}__${selectedTheater.id}__${selectedShowtime}`
      : null

  const [bookedSeats, setBookedSeats] = useState([])

  useEffect(() => {
    if (bookingKey) {
      const stored = getBookedSeatsForKey(bookingKey)
      setBookedSeats(stored)
      setSelectedSeats((current) =>
        current.filter((seat) => !stored.includes(seat)),
      )
    }
  }, [bookingKey, setSelectedSeats])

  const handleCityChange = (cityName) => {
    setSelectedCity(cityName)
    setSelectedTheater(null)
    setSelectedShowtime('')
    setSelectedSeats([])
  }

  const handleTheaterChange = (theaterId) => {
    const theater = theatersForCity.find((t) => t.id === theaterId) || null
    setSelectedTheater(theater)
    setSelectedShowtime('')
    setSelectedSeats([])
  }

  const handleShowtimeChange = (showtime) => {
    setSelectedShowtime(showtime)
    setSelectedSeats([])
  }

  const handleToggleSeat = (seatId) => {
    if (!bookingKey) return
    if (bookedSeats.includes(seatId)) return

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId],
    )
  }

  const canSubmit =
    !!selectedMovie &&
    !!selectedCity &&
    !!selectedTheater &&
    !!selectedShowtime &&
    selectedSeats.length > 0

  const handleQuickSelection = () => {
    if (!bookingKey) return
    const preferredRow = 'C'
    const targetSeats = [5, 6, 7]
      .map((n) => buildSeatId(preferredRow, n))
      .filter((seat) => !bookedSeats.includes(seat))
    if (targetSeats.length === 0) return
    setSelectedSeats(targetSeats)
  }

  const handleSubmit = () => {
    if (!canSubmit || !bookingKey) return
    navigate('/checkout')
  }

  if (loading) {
    return <LoadingState label="Fetching theaters and showtimes..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadTheaters} />
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
            Step 2 · Choose seats
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
            Select your experience
          </h1>
          <p className="text-xs text-slate-300 sm:text-sm">
            Pick a country, city, cinema, showtime and then reserve the perfect
            seats on the map.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <InfoChip label="Movie" value={selectedMovie?.title} />
          <InfoChip label="Country" value={COUNTRIES[selectedCountry]?.name} />
          <InfoChip label="City" value={selectedCity} />
          <InfoChip label="Theater" value={selectedTheater?.name} />
          <InfoChip label="Showtime" value={selectedShowtime} />
        </div>
      </header>

      <section className="grid gap-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.6fr)]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-4 shadow-sm shadow-black/50">
            <div className="grid gap-3">
              <SelectField
                label="Country"
                value={selectedCountry}
                onChange={setSelectedCountry}
                options={Object.values(COUNTRIES).map((c) => ({
                  value: c.code,
                  label: c.name,
                }))}
                placeholder="Select a country"
              />
              <SelectField
                label="City"
                value={selectedCity}
                onChange={handleCityChange}
                options={cities}
                placeholder="Select a city"
              />
              <SelectField
                label="Theater"
                value={selectedTheater?.id ?? ''}
                onChange={handleTheaterChange}
                options={theatersForCity.map((t) => ({
                  value: t.id,
                  label: t.name,
                }))}
                placeholder={
                  selectedCity ? 'Select a theater' : 'Choose city first'
                }
                disabled={!selectedCity}
              />
              <SelectField
                label="Showtime"
                value={selectedShowtime}
                onChange={handleShowtimeChange}
                options={showtimesForTheater.map((time) => ({
                  value: time,
                  label: time,
                }))}
                placeholder={
                  selectedTheater ? 'Select a showtime' : 'Choose theater first'
                }
                disabled={!selectedTheater}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-4 text-xs text-slate-300 shadow-sm shadow-black/50">
            <h2 className="mb-2 text-sm font-semibold text-slate-100">
              Booking summary
            </h2>
            <ul className="space-y-1.5">
              <li>
                <span className="text-slate-400">Movie:</span>{' '}
                <span className="font-medium">{selectedMovie?.title ?? '-'}</span>
              </li>
              <li>
                <span className="text-slate-400">City:</span>{' '}
                <span className="font-medium">{selectedCity || '-'}</span>
              </li>
              <li>
                <span className="text-slate-400">Theater:</span>{' '}
                <span className="font-medium">
                  {selectedTheater?.name ?? '-'}
                </span>
              </li>
              <li>
                <span className="text-slate-400">Showtime:</span>{' '}
                <span className="font-medium">{selectedShowtime || '-'}</span>
              </li>
              <li>
                <span className="text-slate-400">Selected seats:</span>{' '}
                <span className="font-medium">
                  {selectedSeats.length > 0
                    ? selectedSeats.join(', ')
                    : 'None'}
                </span>
              </li>
              <li>
                <span className="text-slate-400">Estimated total:</span>{' '}
                <span className="font-medium">
                  {formatCurrency(
                    (selectedMovie?.priceByCountry?.[selectedCountry] ??
                      selectedMovie?.priceByCountry?.IN ??
                      250) * selectedSeats.length || 0,
                    selectedCountry,
                  )}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <SeatGrid
            bookedSeats={bookedSeats}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
            isDisabled={!selectedCity || !selectedTheater || !selectedShowtime}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={!bookingKey}
              onClick={handleQuickSelection}
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-4 py-1.5 text-xs font-medium text-slate-100 shadow-sm transition hover:border-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Auto-pick best seats
            </button>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="inline-flex items-center justify-center rounded-full bg-violet-500 px-6 py-2 text-sm font-semibold text-slate-50 shadow-sm shadow-violet-500/50 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

