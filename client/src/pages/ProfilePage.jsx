import { useNavigate } from 'react-router-dom'
import { useBooking } from '../state/BookingContext.jsx'
import { COUNTRIES } from '../config/countries.js'

export function ProfilePage() {
  const navigate = useNavigate()
  const { selectedCountry, tickets, logout } = useBooking()

  const country = COUNTRIES[selectedCountry]
  const countryName = country?.name ?? 'India / Nepal'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-400 text-xl font-semibold text-slate-950 shadow-[0_0_30px_rgba(129,140,248,0.9)] sm:h-16 sm:w-16">
            JD
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
              John Doe
            </h1>
            <p className="text-xs text-slate-300 sm:text-sm">
              Demo moviegoer profile · Data stored only in your browser.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-100 shadow-sm transition hover:border-rose-400 hover:text-rose-200 sm:text-sm"
        >
          Logout
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-3 rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 text-sm text-slate-200 shadow-sm shadow-black/50">
          <h2 className="text-sm font-semibold text-slate-100">Account</h2>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-2 text-xs sm:grid-cols-2 sm:text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Name
              </dt>
              <dd className="font-medium text-slate-100">John Doe</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Email
              </dt>
              <dd className="font-medium text-slate-100">
                john.doe@example.com
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Country
              </dt>
              <dd className="font-medium text-slate-100">{countryName}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Tickets booked
              </dt>
              <dd className="font-medium text-slate-100">
                {tickets?.length ?? 0}
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-3 rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 text-xs text-slate-300 shadow-sm shadow-black/50 sm:text-sm">
          <h2 className="text-sm font-semibold text-slate-100">
            Session & privacy
          </h2>
          <p>
            This profile is completely fake and exists only for this demo. There
            is no real authentication and no data is sent to a backend.
          </p>
          <p>
            When you press <span className="font-semibold">Logout</span>, your
            local booking state and stored tickets are cleared from{' '}
            <span className="font-mono text-[11px]">localStorage</span>, and
            the app returns to its initial state.
          </p>
        </div>
      </section>
    </div>
  )
}

