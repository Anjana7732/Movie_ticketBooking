export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled,
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-slate-200 sm:text-sm">
      <span>{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs text-slate-100 shadow-sm outline-none transition-colors focus:border-sky-400 focus:ring-1 focus:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-60 sm:h-10 sm:text-sm"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function InfoChip({ label, value }) {
  if (!value) return null
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-300">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-slate-100">{value}</span>
    </div>
  )
}

