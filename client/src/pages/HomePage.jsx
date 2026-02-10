import { Link } from 'react-router-dom'
import { LoadingState, ErrorState } from '../components/Feedback.jsx'
import { MovieCard } from '../components/MovieCard.jsx'
import { useState } from 'react'
import { useMovies } from '../hooks/useMovies.js'
import { CategoryTabs } from '../components/CategoryTabs.jsx'
import { MOVIE_CATEGORIES } from '../services/movieApi.js'
import { useBooking } from '../state/BookingContext.jsx'

export function HomePage() {
  const { selectedCountry } = useBooking()
  const [category, setCategory] = useState(MOVIE_CATEGORIES.TRENDING)
  const { movies, loading, error } = useMovies({
    category,
    country: selectedCountry,
  })

  if (loading) {
    return <LoadingState label="Fetching movies..." />
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => window.location.reload()}
      />
    )
  }

  const [featuredMovie, ...rest] = movies

  return (
    <div className="flex w-full flex-col gap-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
            Browse movies
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Realistic posters from public demo APIs, localized categories, and
            Nepali specials.
          </p>
        </div>
        <CategoryTabs value={category} onChange={setCategory} />
      </header>

      {featuredMovie && (
        <section className="relative overflow-hidden rounded-3xl border border-violet-700/40 bg-gradient-to-r from-violet-950 via-slate-950 to-slate-950 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.35),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.35),_transparent_55%)]" />
          <div className="relative flex flex-col gap-6 px-5 py-6 sm:flex-row sm:px-8 sm:py-8 lg:gap-10 lg:px-10 lg:py-10">
            <div className="order-2 mt-4 w-full max-w-xs shrink-0 self-center overflow-hidden rounded-2xl border border-violet-500/50 bg-slate-900/60 shadow-[0_0_40px_rgba(129,140,248,0.7)] sm:order-1 sm:mt-0">
              <img
                src={featuredMovie.poster}
                alt={featuredMovie.title}
                className="aspect-[2/3] w-full object-cover"
              />
            </div>

            <div className="order-1 flex flex-1 flex-col gap-4 sm:order-2">
              <div className="flex items-center gap-3 text-xs text-violet-100/90">
                <span className="inline-flex items-center rounded-full bg-violet-500/20 px-3 py-1 font-semibold uppercase tracking-[0.18em] text-[10px] text-violet-200">
                  Now showing
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-1 text-[11px] text-slate-100">
                  ★ {featuredMovie.rating.toFixed(1)}
                  <span className="text-slate-400">
                    · {featuredMovie.duration} min
                  </span>
                </span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
                {featuredMovie.title}
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-slate-200/90 sm:text-base">
                {featuredMovie.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-violet-100/90">
                {Array.isArray(featuredMovie.genre) &&
                  featuredMovie.genre.map((g) => (
                    <span
                      key={g}
                      className="rounded-full bg-black/30 px-3 py-1 text-[11px]"
                    >
                      {g}
                    </span>
                  ))}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Link
                  to={`/movie/${encodeURIComponent(featuredMovie.id)}`}
                  className="inline-flex items-center justify-center rounded-full bg-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-50 shadow-[0_0_30px_rgba(139,92,246,0.9)] transition hover:bg-violet-400"
                >
                  Book tickets
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-slate-600/70 bg-slate-950/60 px-4 py-2.5 text-sm font-medium text-slate-100 shadow-sm transition hover:border-violet-400 hover:bg-slate-900"
                >
                  Watch trailer
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              All movies
            </h2>
            <p className="text-xs text-slate-400">
              Pick from Bollywood, Hollywood, Nepali, trending and upcoming
              titles.
            </p>
          </div>
          <button className="hidden items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-sm hover:border-violet-400 sm:inline-flex">
            Explore more
          </button>
        </div>

        <div className="mt-1 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  )
}

