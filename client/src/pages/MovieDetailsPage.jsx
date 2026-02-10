import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadingState, ErrorState } from '../components/Feedback.jsx'
import { useBooking } from '../state/BookingContext.jsx'
import { getMovieByGlobalId } from '../services/movieApi.js'
import { LanguageTag } from '../components/LanguageTag.jsx'
import { formatCurrency } from '../utils/formatCurrency.js'

export function MovieDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { setSelectedMovie, resetBookingFlow, selectedCountry, selectedMovie } =
    useBooking()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async (movieId) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMovieByGlobalId(movieId)
      setMovie(data)
    } catch (err) {
      setError(err.message || 'Failed to load movie')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return

    // If we already have this movie in context (e.g. from Home page),
    // reuse it to avoid an extra network call.
    if (selectedMovie && String(selectedMovie.id) === String(id)) {
      setMovie(selectedMovie)
      setLoading(false)
      return
    }

    load(id)
  }, [id, selectedMovie])

  if (loading) {
    return <LoadingState label="Loading movie details..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />
  }

  if (!movie) {
    return (
      <ErrorState
        message="Movie not found. Please go back and choose another movie."
        onRetry={() => navigate('/')}
      />
    )
  }

  const handleBook = () => {
    resetBookingFlow()
    setSelectedMovie(movie)
    navigate('/booking')
  }

  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row">
      <div className="relative w-full max-w-sm shrink-0">
        <div className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.35),_transparent_55%)]" />
        <div className="overflow-hidden rounded-3xl border border-violet-600/60 bg-slate-950/80 shadow-[0_24px_80px_rgba(15,23,42,0.95)]">
          <img
            src={movie.poster}
            alt={movie.title}
            className="aspect-[2/3] w-full object-cover"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-5">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-violet-200">
              <span>Movie</span>
              <span className="h-1 w-1 rounded-full bg-violet-400" />
              <span>Details</span>
            </div>
            <LanguageTag
              language={movie.language}
              label={movie.languageLabel}
            />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
            {movie.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 sm:text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 font-semibold text-amber-300">
              ★ {movie.rating.toFixed(1)}
              <span className="text-[11px] font-normal text-slate-300">
                Audience score
              </span>
            </span>
            <span className="rounded-full bg-slate-900/70 px-3 py-1 text-xs text-slate-200">
              {movie.duration} min
            </span>
            <span className="flex flex-wrap gap-1 text-[11px] text-violet-200">
              {Array.isArray(movie.genre)
                ? movie.genre.map((g) => (
                    <span
                      key={g}
                      className="rounded-full bg-black/40 px-2 py-0.5"
                    >
                      {g}
                    </span>
                  ))
                : movie.genre}
            </span>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 text-sm text-slate-200 shadow-sm shadow-black/40">
            <h2 className="text-sm font-semibold text-slate-100">Synopsis</h2>
            <p className="mt-2 leading-relaxed text-slate-200">
              {movie.description}
            </p>
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 text-xs text-slate-300 shadow-sm shadow-black/40">
            <h2 className="text-sm font-semibold text-slate-100">
              Session info
            </h2>
            <ul className="space-y-1.5">
              <li>
                <span className="text-slate-400">Runtime:</span>{' '}
                <span className="font-medium">{movie.duration} minutes</span>
              </li>
              <li>
                <span className="text-slate-400">Rating:</span>{' '}
                <span className="font-medium">
                  {movie.rating.toFixed(1)} / 10
                </span>
              </li>
              <li>
                <span className="text-slate-400">Base price:</span>{' '}
                <span className="font-medium">
                  {formatCurrency(
                    movie.priceByCountry?.[selectedCountry] ??
                      movie.priceByCountry?.IN ??
                      250,
                    selectedCountry,
                  )}{' '}
                  per seat
                </span>
              </li>
            </ul>
          </div>
        </section>

        <div className="mt-1 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleBook}
            className="inline-flex items-center justify-center rounded-full bg-violet-500 px-6 py-2.5 text-sm font-semibold text-slate-50 shadow-[0_0_26px_rgba(139,92,246,0.9)] transition hover:bg-violet-400"
          >
            Book tickets
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-100 shadow-sm transition hover:border-violet-400"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}

