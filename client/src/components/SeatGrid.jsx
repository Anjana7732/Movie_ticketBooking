const ROWS = ['A', 'B', 'C', 'D', 'E']
const SEATS_PER_ROW = 10

export function buildSeatId(row, number) {
  return `${row}${number}`
}

export function SeatGrid({
  bookedSeats,
  selectedSeats,
  onToggleSeat,
  isDisabled,
}) {
  const bookedSet = new Set(bookedSeats)
  const selectedSet = new Set(selectedSeats)

  return (
    <div className="w-full rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 p-5 shadow-[0_22px_70px_rgba(15,23,42,0.95)]">
      <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
        <span className="uppercase tracking-[0.28em] text-[10px] text-slate-500">
          Screen
        </span>
        <div className="h-1.5 w-52 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-sky-400 shadow-[0_0_30px_rgba(129,140,248,0.9)]" />
        <span className="hidden text-right text-[11px] text-slate-500 sm:block">
          Best seats are in the middle rows
        </span>
      </div>

      <div className="space-y-2">
        {ROWS.map((row) => (
          <div key={row} className="flex items-center gap-2">
            <span className="w-5 text-xs font-semibold text-slate-400">
              {row}
            </span>
            <div className="grid flex-1 grid-cols-10 gap-1.5 sm:gap-2">
              {Array.from({ length: SEATS_PER_ROW }).map((_, index) => {
                const seatNumber = index + 1
                const seatId = buildSeatId(row, seatNumber)
                const isBooked = bookedSet.has(seatId)
                const isSelected = selectedSet.has(seatId)

                return (
                  <button
                    key={seatId}
                    type="button"
                    disabled={isBooked || isDisabled}
                    onClick={() => onToggleSeat(seatId)}
                    className={[
                      'relative flex h-8 items-center justify-center rounded-md border text-xs font-semibold transition-all sm:h-9',
                      isBooked &&
                        'cursor-not-allowed border-rose-500/80 bg-rose-600/80 text-rose-50 shadow-[0_0_10px_rgba(248,113,113,0.6)]',
                      !isBooked &&
                        isSelected &&
                        'border-violet-400/90 bg-violet-500 text-violet-950 shadow-[0_0_20px_rgba(139,92,246,0.9)]',
                      !isBooked &&
                        !isSelected &&
                        'border-slate-700 bg-slate-900/90 text-slate-200 hover:border-violet-400 hover:bg-slate-900',
                      isDisabled && !isBooked && !isSelected && 'opacity-50',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {seatNumber}
                  </button>
                )
              })}
            </div>
            <span className="w-5 text-xs font-semibold text-slate-400">
              {row}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
        <LegendDot className="border-slate-700 bg-slate-800/90" label="Available" />
        <LegendDot className="border-emerald-400/80 bg-emerald-500" label="Selected" />
        <LegendDot className="border-rose-500/80 bg-rose-600/80" label="Booked" />
      </div>
    </div>
  )
}

function LegendDot({ className, label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={[
          'inline-block h-3 w-3 rounded-sm border shadow-sm',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
      <span>{label}</span>
    </span>
  )
}

