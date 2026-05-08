import { useField } from 'formik'

export default function TextField({ label, helper, className = '', ...props }) {
  const [field, meta] = useField(props)
  const showError = meta.touched && meta.error

  return (
    <label className={`block text-left ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-700">
        {label}
      </span>
      <input
        {...field}
        {...props}
        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/20 ${
          showError ? 'border-rose-400/60' : 'border-slate-200'
        }`}
      />
      {showError ? (
        <span className="mt-1 block text-xs text-rose-600">{meta.error}</span>
      ) : helper ? (
        <span className="mt-1 block text-xs text-slate-500">{helper}</span>
      ) : null}
    </label>
  )
}

