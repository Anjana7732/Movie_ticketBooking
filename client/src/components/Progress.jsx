const steps = [
  { id: 'movie', label: 'Browse', path: '/' },
  { id: 'details', label: 'Details', path: '/movie' },
  { id: 'seats', label: 'Seats', path: '/booking' },
  { id: 'checkout', label: 'Checkout', path: '/checkout' },
]

function getActiveStep(pathname) {
  if (pathname.startsWith('/checkout') || pathname.startsWith('/summary'))
    return 'checkout'
  if (pathname.startsWith('/booking')) return 'seats'
  if (pathname.startsWith('/movie')) return 'details'
  return 'movie'
}

export function BookingProgress({ currentPath }) {
  const active = getActiveStep(currentPath)

  return (
    <div className="border-b border-slate-800 bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 text-xs sm:text-sm">
        {steps.map((step, index) => {
          const isActive = step.id === active
          const isCompleted =
            steps.findIndex((s) => s.id === active) > index

          return (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={[
                  'flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors',
                  isActive
                    ? 'border-sky-400 bg-sky-500 text-slate-950'
                    : isCompleted
                      ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                      : 'border-slate-700 bg-slate-900 text-slate-400',
                ].join(' ')}
              >
                {index + 1}
              </div>
              <span
                className={[
                  'hidden font-medium sm:inline',
                  isActive
                    ? 'text-sky-300'
                    : isCompleted
                      ? 'text-emerald-300'
                      : 'text-slate-500',
                ].join(' ')}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className="hidden h-px flex-1 bg-gradient-to-r from-slate-700 via-slate-700/40 to-slate-800 sm:block" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

