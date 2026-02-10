export function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex flex-1 items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
        <p className="text-sm text-slate-300">{label}</p>
      </div>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-1 items-center justify-center py-16">
      <div className="flex max-w-sm flex-col items-center gap-3 rounded-2xl border border-rose-500/40 bg-rose-950/40 px-6 py-5 text-center text-sm text-rose-100">
        <p className="font-medium">Something went wrong</p>
        <p className="text-xs text-rose-200/80">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-1 inline-flex items-center justify-center rounded-full bg-rose-500 px-4 py-1.5 text-xs font-semibold text-rose-950 shadow-sm shadow-rose-500/40 transition hover:bg-rose-400"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  )
}

