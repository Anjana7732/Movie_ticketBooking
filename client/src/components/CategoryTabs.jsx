import { MOVIE_CATEGORIES } from '../services/movieApi.js'

const CATEGORY_CONFIG = [
  { id: MOVIE_CATEGORIES.TRENDING, label: 'Trending' },
  { id: MOVIE_CATEGORIES.BOLLYWOOD, label: 'Bollywood' },
  { id: MOVIE_CATEGORIES.HOLLYWOOD, label: 'Hollywood' },
  { id: MOVIE_CATEGORIES.NEPALI, label: 'Nepali' },
  { id: MOVIE_CATEGORIES.UPCOMING, label: 'Upcoming' },
]

export function CategoryTabs({ value, onChange }) {
  return (
    <div className="inline-flex rounded-full border border-slate-800 bg-slate-950/90 p-1 text-xs text-slate-200 shadow-sm shadow-black/50">
      {CATEGORY_CONFIG.map((cat) => {
        const isActive = value === cat.id
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={[
              'px-3 py-1.5 rounded-full transition text-[11px] font-medium',
              isActive
                ? 'bg-violet-500 text-slate-950 shadow-[0_0_16px_rgba(139,92,246,0.8)]'
                : 'text-slate-300 hover:bg-slate-900/90',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}

