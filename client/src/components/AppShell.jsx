import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Button from './ui/Button.jsx'

export default function AppShell({ title, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function onLogout() {
    await logout()
    navigate('/auth')
  }

  return (
    <div className="nw-bg min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <header className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="text-left">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.svg"
                  alt="Nowwagon"
                  className="h-9 w-9"
                  loading="eager"
                />
                <div>
                  <div className="text-xs font-semibold tracking-widest text-slate-500">
                    NOWWAGON
                  </div>
                  <div className="text-lg font-extrabold text-slate-900">{title}</div>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              {user ? (
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-500">
                    {user.role} • {user.email}
                  </div>
                </div>
              ) : null}
              <Button variant="subtle" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="mt-6">{children}</main>
      </div>
    </div>
  )
}

