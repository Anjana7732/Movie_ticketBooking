import { Link, NavLink, useLocation } from 'react-router-dom'
import { BookingProgress } from './Progress.jsx'
import { useBooking } from '../state/BookingContext.jsx'
import { COUNTRIES } from '../config/countries.js'

export function Layout({ children }) {
  const location = useLocation()
  const { selectedMovie, selectedCountry, setSelectedCountry } = useBooking()

  return (
    <div className="flex min-h-screen flex-col bg-transparent text-slate-50">
      <header className="border-b border-slate-900/80 bg-gradient-to-r from-violet-950/90 via-slate-950/90 to-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
          <Link
            to="/"
            className="flex items-center gap-3 text-lg font-semibold tracking-tight text-violet-100"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-400 text-base font-bold text-slate-950 shadow-[0_0_18px_rgba(129,140,248,0.7)]">
              🎬
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-violet-300/80">
                CINEFLOW
              </span>
              <span className="text-sm font-semibold text-slate-50">
                Movie Tickets
              </span>
            </span>
          </Link>
          <div className="flex flex-1 items-center justify-end gap-3 text-xs sm:text-sm">
            <nav className="hidden items-center gap-4 text-xs font-medium text-slate-300 sm:flex">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  [
                    'cursor-pointer transition-colors',
                    isActive
                      ? 'text-violet-200'
                      : 'text-slate-300 hover:text-slate-50',
                  ].join(' ')
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/tickets"
                className={({ isActive }) =>
                  [
                    'cursor-pointer transition-colors',
                    isActive
                      ? 'text-violet-200'
                      : 'text-slate-300 hover:text-slate-50',
                  ].join(' ')
                }
              >
                My Tickets
              </NavLink>
            </nav>
            {selectedMovie && (
              <div className="hidden items-center gap-2 rounded-full border border-violet-500/40 bg-violet-950/40 px-3 py-1 text-violet-100/90 shadow-sm shadow-violet-900/50 sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                <span className="font-medium">Booking:</span>
                <span className="truncate text-xs text-slate-100 max-w-[170px]">
                  {selectedMovie.title}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-2.5 py-1 text-[11px] text-slate-200 shadow-sm shadow-black/40 sm:flex">
                <span className="text-slate-400">Country</span>
                <select
                  className="bg-transparent text-xs font-medium text-slate-100 outline-none"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  {Object.values(COUNTRIES).map((country) => (
                    <option
                      key={country.code}
                      value={country.code}
                      className="bg-slate-900 text-slate-100"
                    >
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  [
                    'inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/80 bg-slate-950/80 text-sm font-semibold shadow-sm shadow-black/40 transition-colors',
                    isActive
                      ? 'border-violet-400 text-violet-200'
                      : 'text-slate-200 hover:border-violet-400 hover:text-violet-200',
                  ].join(' ')
                }
                aria-label="Profile"
              >
                👤
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      <BookingProgress currentPath={location.pathname} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6 lg:px-6 lg:py-8">
        {children}
      </main>

      <footer className="border-t border-slate-900/80 bg-gradient-to-r from-slate-950 via-slate-950 to-violet-950/90 text-xs text-slate-500">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <span className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} Cineflow Interactive · Demo booking
            experience only.
          </span>
          <span className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
            <span>Built with React · Vite · Tailwind · Express</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:inline-block" />
            <span className="hidden sm:inline-block">All data is mock/demo.</span>
          </span>
        </div>
      </footer>
    </div>
  )
}

