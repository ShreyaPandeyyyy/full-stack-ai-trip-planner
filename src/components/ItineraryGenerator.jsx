import { useEffect, useState } from "react";

export default function ItineraryGenerator({ icp, rules, onBack }) {
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState([]);

  useEffect(() => {
    // Fake generation delay (simulates AI)
    const timer = setTimeout(() => {
      const start = new Date(rules.startDate);
      const end = new Date(rules.endDate);
      const totalDays =
        Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

      const generated = Array.from({ length: totalDays }).map((_, i) => ({
        day: i + 1,
        title: `Day ${i + 1}: Work + Light Exploration`,
        agenda: [
          "Hotel breakfast",
          "Meetings / work sessions",
          "Lunch near venue",
          "Local activity / team dinner",
        ],
      }));

      setDays(generated);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [rules]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm text-slate-400">Step 3 of 3</p>
        <h1 className="text-3xl font-semibold mt-2">
          Day-wise itinerary
        </h1>

        <p className="text-slate-300 mt-3">
          Generated for <span className="font-medium">{rules.city}</span> ·{" "}
          {rules.teamSize} people · {icp === "team" ? "Team travel" : "Personal"}
        </p>

        {loading ? (
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6 animate-pulse">
            <p className="text-slate-400">
              Generating itinerary based on your rules…
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {days.map((d) => (
              <div
                key={d.day}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <h3 className="font-medium text-lg">{d.title}</h3>
                <ul className="mt-3 space-y-1 text-slate-300 text-sm">
                  {d.agenda.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <button
            onClick={onBack}
            className="rounded-lg border border-slate-800 px-4 py-2 text-sm hover:bg-slate-900 transition"
          >
            Back to rules
          </button>

          <button
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 transition"
          >
            Export / Share (next)
          </button>
        </div>
      </div>
    </div>
  );
}
