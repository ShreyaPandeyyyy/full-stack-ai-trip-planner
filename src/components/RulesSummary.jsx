export default function RulesSummary({ rules, onEdit, onGenerate }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <p className="text-sm text-slate-400">Step 2 of 3</p>
          <h1 className="text-3xl font-semibold mt-2">Review trip rules</h1>
          <p className="text-slate-300 mt-3 max-w-2xl">
            Please review the non-negotiable constraints below.  
            The itinerary will strictly follow these rules.
          </p>
        </header>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <Rule label="City" value={rules.city} />
          <Rule label="Dates" value={`${rules.startDate} → ${rules.endDate}`} />
          <Rule label="Team size" value={`${rules.teamSize} people`} />
          <Rule
            label="Budget"
            value={`₹${rules.budgetMin} – ₹${rules.budgetMax}`}
          />
          <Rule label="Pace" value={rules.pace} />
          <Rule
            label="Wi-Fi required"
            value={rules.needsWifi ? "Yes" : "No"}
          />
          <Rule
            label="Near venue"
            value={rules.nearVenue ? "Yes" : "No"}
          />
          <Rule
            label="Meeting hours"
            value={`${rules.meetingStart} – ${rules.meetingEnd}`}
          />

          {rules.notes && (
            <Rule label="Notes" value={rules.notes} multiline />
          )}
        </section>

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={onEdit}
            className="rounded-lg border border-slate-800 px-4 py-2 text-sm hover:bg-slate-900 transition"
          >
            Edit rules
          </button>

          <button
            onClick={onGenerate}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition"
          >
            Generate itinerary
          </button>
        </div>
      </div>
    </div>
  );
}

function Rule({ label, value, multiline = false }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-sm text-slate-400">{label}</span>
      <span
        className={`text-sm text-slate-100 text-right ${
          multiline ? "max-w-xl" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
