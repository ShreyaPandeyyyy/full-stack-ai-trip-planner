export default function IcpGate({ onSelect }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <p className="text-sm text-slate-400">Team Travel Planner</p>
          <h1 className="text-3xl font-semibold mt-2">
            Who are you planning this trip for?
          </h1>
          <p className="text-slate-300 mt-3">
            This experience is optimized for{" "}
            <span className="font-medium">company/team travel</span> workflows
            (budgets, constraints, shareable itineraries).
          </p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => onSelect("team")}
            className="w-full text-left rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-800 transition p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Team / Company Travel</h2>
                <p className="text-slate-300 mt-1">
                  For ops/admin/marketing users planning trips for 2+ people with
                  budgets and rules.
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                Recommended
              </span>
            </div>
          </button>

          <button
            onClick={() => onSelect("personal")}
            className="w-full text-left rounded-2xl border border-slate-800 bg-transparent hover:bg-slate-900 transition p-5"
          >
            <h2 className="text-lg font-semibold">Personal Travel</h2>
            <p className="text-slate-300 mt-1">
              You can still use it, but the default flow is built for business
              constraints and clarity.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
