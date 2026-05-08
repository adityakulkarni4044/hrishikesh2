import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="nw-bg min-h-screen flex items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          Loading…
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace />
  if (role && user.role !== role) return <Navigate to={`/dashboard/${user.role}`} replace />
  return children
}

