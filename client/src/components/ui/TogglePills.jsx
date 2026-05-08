export default function TogglePills({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              active
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-700 hover:bg-orange-50'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

