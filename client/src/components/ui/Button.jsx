export default function Button({
  children,
  className = '',
  variant = 'primary',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-orange-400/60 disabled:opacity-60 disabled:cursor-not-allowed'
  const styles = {
    primary:
      'bg-orange-500 text-white hover:bg-orange-400 shadow-[0_10px_30px_-12px_rgba(249,115,22,0.55)]',
    subtle:
      'bg-white text-slate-900 hover:bg-orange-50 border border-slate-200 shadow-sm',
    danger:
      'bg-rose-500 text-white hover:bg-rose-400 shadow-[0_10px_30px_-12px_rgba(244,63,94,0.5)]',
  }

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

