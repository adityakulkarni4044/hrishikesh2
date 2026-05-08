import AppShell from '../../components/AppShell.jsx'

export default function DriverDashboard() {
  return (
    <AppShell title="Driver Dashboard">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-slate-900">Assigned tasks</div>
          <div className="mt-1 text-sm text-slate-700">
            View pickup/delivery requests assigned to you.
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-slate-900">Availability</div>
          <div className="mt-1 text-sm text-slate-700">
            Update your online/offline status and service area.
          </div>
        </div>
      </div>
    </AppShell>
  )
}

