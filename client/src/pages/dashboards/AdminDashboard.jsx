import AppShell from '../../components/AppShell.jsx'

export default function AdminDashboard() {
  return (
    <AppShell title="Admin Dashboard">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-slate-900">Overview</div>
          <div className="mt-1 text-sm text-slate-700">
            Manage users, approvals, and platform settings.
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-slate-900">Drivers</div>
          <div className="mt-1 text-sm text-slate-700">Review onboarding and driver status.</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-slate-900">Orders</div>
          <div className="mt-1 text-sm text-slate-700">Monitor pickup & delivery flow.</div>
        </div>
      </div>
    </AppShell>
  )
}

