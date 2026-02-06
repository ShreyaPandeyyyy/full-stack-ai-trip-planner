import { useMemo, useState } from "react";

function formatMoney(n) {
  if (n === "" || n === null || n === undefined) return "";
  const num = Number(n);
  if (Number.isNaN(num)) return String(n);
  return num.toLocaleString("en-IN");
}

function parseDate(d) {
  // expects "YYYY-MM-DD" from input[type=date]
  if (!d) return null;
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
}

function daysBetween(startStr, endStr) {
  const s = parseDate(startStr);
  const e = parseDate(endStr);
  if (!s || !e) return 3;
  const diff = Math.round((e - s) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1); // inclusive
}

function buildPrompt({ icp, rules }) {
  const nights = Math.max(1, daysBetween(rules.startDate, rules.endDate) - 1);

  return `
You are an expert travel planner. Create a day-wise itinerary that strictly follows these non-negotiable trip rules.

Output MUST be valid JSON only, no markdown, no extra text.

JSON format:
{
  "title": "string",
  "city": "string",
  "days": [
    {
      "day": 1,
      "label": "string",
      "items": ["string", "string", ...]
    }
  ]
}

Rules:
- ICP: ${icp === "team" ? "Team/Company travel" : "Personal travel"}
- City: ${rules.city}
- Dates: ${rules.startDate} to ${rules.endDate} (${daysBetween(
    rules.startDate,
    rules.endDate
  )} days, ${nights} nights)
- Team size: ${rules.teamSize}
- Pace: ${rules.pace}
- Budget range (INR): ${rules.minBudget} to ${rules.maxBudget}
- Wi-Fi required: ${rules.wifiRequired ? "Yes" : "No"}
- Stay near venue: ${rules.nearVenue ? "Yes" : "No"}
- Meeting hours: ${rules.meetingStart} to ${rules.meetingEnd}
- Notes: ${rules.notes || "None"}

Constraints:
- For team travel, respect meeting hours: schedule work/meetings inside that window.
- Include meals, local commute, and one light activity/dinner if budget allows.
- Keep items short and actionable (5–7 items per day).
- Do NOT violate any rule.
`.trim();
}

export default function ItineraryGenerator({ icp, rules, onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const daysCount = useMemo(
    () => daysBetween(rules.startDate, rules.endDate),
    [rules.startDate, rules.endDate]
  );

  // IMPORTANT:
  // Replace this with your real Gemini/OpenAI call (or your existing backend endpoint).
  // For now, we generate a clean "dummy" itinerary so UI + Vercel build works 100%.
  const generateDummy = () => {
    const days = Array.from({ length: daysCount }, (_, i) => ({
      day: i + 1,
      label: icp === "team" ? "Work + Light Exploration" : "Explore + Relax",
      items:
        icp === "team"
          ? [
              "Hotel breakfast",
              `Meetings / work sessions (${rules.meetingStart}–${rules.meetingEnd})`,
              "Lunch near venue",
              rules.nearVenue ? "Stay near venue / minimal commute" : "Commute + buffer time",
              rules.wifiRequired ? "Ensure strong Wi-Fi at hotel/café" : "Wi-Fi optional",
              "Local activity / team dinner",
            ]
          : [
              "Breakfast",
              "Top attraction / sightseeing",
              "Local lunch spot",
              "Free time / shopping",
              "Sunset point / café",
              "Dinner + return",
            ],
    }));

    return {
      title: `${icp === "team" ? "Team" : "Personal"} Trip Itinerary`,
      city: rules.city,
      days,
    };
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      // ✅ For now (UI-ready):
      const result = generateDummy();

      // ⛳ Later you’ll replace with API call:
      // const prompt = buildPrompt({ icp, rules });
      // const result = await callYourBackend(prompt);

      setData(result);
    } catch (e) {
      setError("Could not generate itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm text-slate-400">Step 3 of 3</p>
        <h1 className="text-3xl font-semibold mt-2">Day-wise itinerary</h1>
        <p className="text-slate-300 mt-3">
          Generated for <span className="font-medium">{rules.city}</span> ·{" "}
          <span className="font-medium">{rules.teamSize}</span> people ·{" "}
          <span className="font-medium">{icp === "team" ? "Team travel" : "Personal travel"}</span>
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-400">Dates</p>
            <p className="mt-1">{rules.startDate} → {rules.endDate}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-400">Budget</p>
            <p className="mt-1">
              ₹{formatMoney(rules.minBudget)} – ₹{formatMoney(rules.maxBudget)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onBack}
            className="rounded-lg border border-slate-800 px-4 py-2 text-sm hover:bg-slate-900 transition"
          >
            Back to summary
          </button>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 transition"
          >
            {loading ? "Generating..." : "Generate itinerary"}
          </button>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        ) : null}

        {data ? (
          <div className="mt-8 space-y-5">
            {data.days.map((d) => (
              <div
                key={d.day}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6"
              >
                <h2 className="text-lg font-semibold">
                  Day {d.day}: {d.label}
                </h2>
                <ul className="mt-3 list-disc pl-5 text-slate-200 space-y-2">
                  {d.items.map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="rounded-lg border border-slate-800 px-4 py-2 text-sm hover:bg-slate-900 transition"
              >
                Back to rules
              </button>
              <button
                onClick={() => alert("Next: Export / Share (we’ll add this next)")}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 transition"
              >
                Export / Share (next)
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
