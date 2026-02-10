import { useMemo, useState } from "react";

const DEFAULT_RULES = {
  tripName: "",
  city: "",
  startDate: "",
  endDate: "",
  teamSize: 2,
  budgetMin: 20000,
  budgetMax: 80000,
  pace: "medium", // light | medium | packed
  needsWifi: true,
  nearVenue: true,
  meetingStart: "10:00",
  meetingEnd: "17:00",
  notes: "",
};

export default function TripRules({ icp, onContinue }) {
  const [rules, setRules] = useState(() => {
    const saved = localStorage.getItem("trip_rules_v1");
    return saved ? JSON.parse(saved) : DEFAULT_RULES;
  });

  const errors = useMemo(() => {
    const e = {};
    if (!rules.city.trim()) e.city = "City is required.";
    if (!rules.startDate) e.startDate = "Start date is required.";
    if (!rules.endDate) e.endDate = "End date is required.";
    if (rules.startDate && rules.endDate && rules.endDate < rules.startDate) {
      e.endDate = "End date must be after start date.";
    }
    if (!rules.teamSize || rules.teamSize < 1) e.teamSize = "Team size must be at least 1.";
    if (Number(rules.budgetMin) < 0) e.budgetMin = "Budget must be valid.";
    if (Number(rules.budgetMax) <= 0) e.budgetMax = "Budget must be valid.";
    if (Number(rules.budgetMax) < Number(rules.budgetMin)) {
      e.budgetMax = "Max budget must be ≥ min budget.";
    }
    return e;
  }, [rules]);

  const isValid = Object.keys(errors).length === 0;

  const update = (key, value) => {
    const next = { ...rules, [key]: value };
    setRules(next);
    localStorage.setItem("trip_rules_v1", JSON.stringify(next));
  };

  const handleContinue = () => {
    if (!isValid) return;
    onContinue(rules);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <p className="text-sm text-slate-400">Step 1 of 3</p>
          <h1 className="text-3xl font-semibold mt-2">Trip Rules (non-negotiables)</h1>
          <p className="text-slate-300 mt-3 max-w-2xl">
            Set the constraints first. This keeps the itinerary focused for your ICP:{" "}
            <span className="font-medium">{icp === "team" ? "Team/Company Travel" : "Personal Travel"}</span>.
          </p>
        </header>

        <div className="grid gap-6">
          {/* Core rules */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-medium mb-4">Core</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Trip name (optional)">
                <input
                  value={rules.tripName}
                  onChange={(e) => update("tripName", e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-slate-600"
                  placeholder="e.g., Bangalore offsite"
                />
              </Field>

              <Field label="City *" error={errors.city}>
                <input
                  value={rules.city}
                  onChange={(e) => update("city", e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-slate-600"
                  placeholder="e.g., Mumbai"
                />
              </Field>

              <Field label="Start date *" error={errors.startDate}>
                <input
                  type="date"
                  value={rules.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-slate-600"
                />
              </Field>

              <Field label="End date *" error={errors.endDate}>
                <input
                  type="date"
                  value={rules.endDate}
                  onChange={(e) => update("endDate", e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-slate-600"
                />
              </Field>

              <Field label="Team size *" error={errors.teamSize}>
                <input
                  type="number"
                  min={1}
                  value={rules.teamSize}
                  onChange={(e) => update("teamSize", Number(e.target.value))}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-slate-600"
                />
              </Field>

              <Field label="Pace">
                <select
                  value={rules.pace}
                  onChange={(e) => update("pace", e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-slate-600"
                >
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="packed">Packed</option>
                </select>
              </Field>
            </div>
          </section>

          {/* Budget */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-medium mb-4">Budget (required)</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Min budget (₹) *" error={errors.budgetMin}>
                <input
                  type="number"
                  min={0}
                  value={rules.budgetMin}
                  onChange={(e) => update("budgetMin", Number(e.target.value))}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-slate-600"
                />
              </Field>

              <Field label="Max budget (₹) *" error={errors.budgetMax}>
                <input
                  type="number"
                  min={0}
                  value={rules.budgetMax}
                  onChange={(e) => update("budgetMax", Number(e.target.value))}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-slate-600"
                />
              </Field>
            </div>
          </section>

          {/* Constraints */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-medium mb-4">Constraints</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Toggle
                label="Wi-Fi required"
                checked={rules.needsWifi}
                onChange={(v) => update("needsWifi", v)}
              />
              <Toggle
                label="Stay near venue"
                checked={rules.nearVenue}
                onChange={(v) => update("nearVenue", v)}
              />

              <Field label="Meeting hours (start)">
                <input
                  type="time"
                  value={rules.meetingStart}
                  onChange={(e) => update("meetingStart", e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-slate-600"
                />
              </Field>

              <Field label="Meeting hours (end)">
                <input
                  type="time"
                  value={rules.meetingEnd}
                  onChange={(e) => update("meetingEnd", e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-slate-600"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Notes (optional)">
                  <textarea
                    value={rules.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    rows={3}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-slate-600"
                    placeholder="Any constraints: preferred area, hotel rating, food preferences, etc."
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* Footer actions */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              These are non-negotiables. The itinerary should respect them.
            </p>

            <button
              onClick={handleContinue}
              disabled={!isValid}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                isValid
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : "bg-slate-800 text-slate-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-slate-300">{label}</span>
        {error ? <span className="text-xs text-rose-400">{error}</span> : null}
      </div>
      {children}
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 hover:bg-slate-900 transition"
    >
      <span className="text-sm text-slate-200">{label}</span>
      <span
        className={`h-5 w-9 rounded-full border transition flex items-center ${
          checked
            ? "bg-emerald-500/20 border-emerald-500/30 justify-end"
            : "bg-slate-800 border-slate-700 justify-start"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full ${
            checked ? "bg-emerald-400" : "bg-slate-400"
          }`}
        />
      </span>
    </button>
  );
}
