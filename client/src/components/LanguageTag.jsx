export function LanguageTag({ language, label }) {
  if (!language && !label) return null

  const code = (language || '').toLowerCase()
  const text =
    label ||
    (code === 'hi'
      ? 'Hindi'
      : code === 'en'
      ? 'English'
      : code === 'ne'
      ? 'Nepali'
      : 'Other')

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-200">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
      <span>{text}</span>
    </span>
  )
}

