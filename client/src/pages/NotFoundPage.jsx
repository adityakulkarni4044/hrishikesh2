import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'

export default function NotFoundPage() {
  return (
    <div className="nw-bg min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-6 text-left shadow-xl backdrop-blur">
        <div className="text-xs font-semibold tracking-widest text-slate-500">404</div>
        <div className="mt-1 text-2xl font-extrabold text-slate-900">Page not found</div>
        <p className="mt-2 text-sm text-slate-700">
          The page you’re looking for doesn’t exist.
        </p>
        <div className="mt-5">
          <Link to="/auth">
            <Button className="w-full">Go to Auth</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

