import { Link } from 'react-router-dom'
import { useBooking } from '../state/BookingContext.jsx'
import { LanguageTag } from './LanguageTag.jsx'
import { formatCurrency } from '../utils/formatCurrency.js'

export function MovieCard({ movie }) {
  const { setSelectedMovie, resetBookingFlow, selectedCountry } = useBooking()

  const handleBookNow = () => {
    resetBookingFlow()
    setSelectedMovie(movie)
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 shadow-[0_18px_40px_rgba(15,23,42,0.85)] transition-transform hover:-translate-y-1.5 hover:border-violet-400/80 hover:shadow-[0_28px_70px_rgba(88,28,135,0.9)]">
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/10 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-slate-100 backdrop-blur">
          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-semibold text-slate-950">
            ★ {movie.rating.toFixed(1)}
          </span>
          <span className="text-[11px] text-slate-200">
            {movie.duration} min
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <header>
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-50">
            {movie.title}
          </h3>
          <div className="mt-1 flex items-center justify-between gap-2">
            <p className="line-clamp-1 text-[11px] uppercase tracking-[0.18em] text-violet-300">
              {Array.isArray(movie.genre) ? movie.genre.join(' • ') : movie.genre}
            </p>
            <LanguageTag
              language={movie.language}
              label={movie.languageLabel}
            />
          </div>
        </header>
        <p className="line-clamp-3 flex-1 text-xs text-slate-300">
          {movie.description}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-emerald-300">
            {formatCurrency(movie.activePrice ?? 250, selectedCountry)}{' '}
            <span className="font-normal text-slate-400">per seat</span>
          </span>
          <Link
            to={`/movie/${encodeURIComponent(movie.id)}`}
            className="inline-flex items-center justify-center rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:border-violet-400 hover:bg-slate-900"
          >
            Details
          </Link>
          <Link
            to="/booking"
            onClick={handleBookNow}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-violet-500 px-3 py-1.5 text-xs font-semibold text-slate-50 shadow-sm shadow-violet-500/50 transition hover:bg-violet-400"
          >
            Book now
          </Link>
        </div>
      </div>
    </article>
  )
}

