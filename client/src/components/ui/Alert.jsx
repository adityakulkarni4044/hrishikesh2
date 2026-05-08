export default function Alert({ tone = 'info', children }) {
  const styles = {
    info: 'border-orange-300 bg-orange-50 text-orange-900',
    error: 'border-rose-200 bg-rose-50 text-rose-900',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  }

  return (
    <div className={`rounded-xl border px-3 py-2 text-sm ${styles[tone]}`}>
      {children}
    </div>
  )
}

