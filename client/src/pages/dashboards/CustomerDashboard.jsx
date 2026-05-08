import AppShell from '../../components/AppShell.jsx'

export default function CustomerDashboard() {
  return (
    <AppShell title="Customer Dashboard">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-slate-900">Create a request</div>
          <div className="mt-1 text-sm text-slate-700">
            Book a porter pickup and delivery (next step).
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-slate-900">Your orders</div>
          <div className="mt-1 text-sm text-slate-700">Track live status and history.</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-slate-900">Support</div>
          <div className="mt-1 text-sm text-slate-700">Reach help for issues/refunds.</div>
        </div>
      </div>
    </AppShell>
  )
}

