// src/components/ItineraryGenerator.jsx
import { useMemo, useState } from "react";
import ExportShare from "./ExportShare";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function formatMoneyINR(n) {
  if (n === "" || n === null || n === undefined) return "";
  const num = Number(String(n).replace(/,/g, ""));
  if (Number.isNaN(num)) return String(n);
  return num.toLocaleString("en-IN");
}

function parseDate(d) {
  if (!d) return null;
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
}

function daysBetween(startStr, endStr) {
  const s = parseDate(startStr);
  const e = parseDate(endStr);
  if (!s || !e) return 0;
  const diff = Math.round((e - s) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
}

function buildPrompt(payload) {
  const {
    travelType,
    destination,
    startDate,
    endDate,
    days,
    peopleCount,
    budget,
    pace,
    interests,
    mustDo,
    foodPref,
    notes,
  } = payload;

  return `
You are an expert travel planner.
Create a day-wise itinerary for a trip.

TRIP DETAILS:
- Destination: ${destination}
- Trip type: ${travelType}
- Dates: ${startDate || "N/A"} to ${endDate || "N/A"} (${days} days)
- People: ${peopleCount}
- Total budget (INR): ${budget || "Not specified"}
- Pace: ${pace}
- Interests: ${interests || "Not specified"}
- Must-do: ${mustDo || "Not specified"}
- Food preference: ${foodPref}
- Notes: ${notes || "None"}

RULES:
- Output must be structured as:
  Day 1: Morning / Afternoon / Evening
  Day 2: ...
- Include approximate cost split per day (stay + food + commute + activities) within budget.
- Keep it realistic: travel times, nearby grouping, avoid too many places in one day.
- Add 2-3 local food suggestions each day.
- End with: "Packing checklist" and "Budget summary".
Return plain text only (no markdown code blocks).
`.trim();
}

export default function ItineraryGenerator() {
  const [travelType, setTravelType] = useState("Team / Company Travel");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [peopleCount, setPeopleCount] = useState(2);
  const [budget, setBudget] = useState("");
  const [pace, setPace] = useState("Balanced");
  const [foodPref, setFoodPref] = useState("Any");
  const [interests, setInterests] = useState("");
  const [mustDo, setMustDo] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState("");

  const days = useMemo(() => {
    const d = daysBetween(startDate, endDate);
    return d || 3;
  }, [startDate, endDate]);

  const canGenerate = useMemo(() => {
    return destination.trim().length >= 2 && days >= 1 && Number(peopleCount) >= 1;
  }, [destination, days, peopleCount]);

  const payload = useMemo(
    () => ({
      travelType,
      destination: destination.trim(),
      startDate,
      endDate,
      days,
      peopleCount: Number(peopleCount),
      budget: budget ? Number(String(budget).replace(/,/g, "")) : "",
      pace,
      interests: interests.trim(),
      mustDo: mustDo.trim(),
      foodPref,
      notes: notes.trim(),
    }),
    [
      travelType,
      destination,
      startDate,
      endDate,
      days,
      peopleCount,
      budget,
      pace,
      interests,
      mustDo,
      foodPref,
      notes,
    ]
  );

  async function generate() {
    setErr("");
    setResult("");

    if (!canGenerate) {
      setErr("Please enter destination and valid details.");
      return;
    }

    setLoading(true);
    try {
      const prompt = buildPrompt(payload);

      const res = await fetch(`${API}/api/itinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, meta: payload }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Request failed (${res.status})`);
      }

      const data = await res.json();
      const text = data?.itinerary || data?.text || data?.result || "";
      if (!text) throw new Error("No itinerary returned from server.");
      setResult(text);
    } catch (e) {
      setErr(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      {/* Header card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-slate-900">
            Generate a Smart Itinerary
          </h2>
          <p className="text-sm text-slate-600">
            Enter your trip details — get a day-wise plan with cost split, food picks,
            and packing list.
          </p>
        </div>

        {/* Travel type selector */}
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <button
            onClick={() => setTravelType("Team / Company Travel")}
            className={`rounded-xl border p-4 text-left transition ${
              travelType === "Team / Company Travel"
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
            }`}
            type="button"
          >
            <div className="text-sm font-semibold">Team / Company Travel</div>
            <div
              className={`mt-1 text-xs ${
                travelType === "Team / Company Travel" ? "text-slate-200" : "text-slate-500"
              }`}
            >
              Optimized for budgets, constraints, and shareable itineraries.
            </div>
          </button>

          <button
            onClick={() => setTravelType("Personal Travel")}
            className={`rounded-xl border p-4 text-left transition ${
              travelType === "Personal Travel"
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
            }`}
            type="button"
          >
            <div className="text-sm font-semibold">Personal Travel</div>
            <div
              className={`mt-1 text-xs ${
                travelType === "Personal Travel" ? "text-slate-200" : "text-slate-500"
              }`}
            >
              Flexible plan, leisure-friendly pacing, local experiences.
            </div>
          </button>
        </div>

        {/* Form */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Destination</label>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Goa, Jaipur, Manali"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">People</label>
              <input
                type="number"
                min={1}
                value={peopleCount}
                onChange={(e) => setPeopleCount(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Pace</label>
              <select
                value={pace}
                onChange={(e) => setPace(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
              >
                <option>Relaxed</option>
                <option>Balanced</option>
                <option>Fast</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">End date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Total budget (₹)</label>
            <input
              value={budget}
              onChange={(e) => setBudget(formatMoneyINR(e.target.value))}
              placeholder="e.g. 25,000"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
            <div className="mt-1 text-xs text-slate-500">
              Days auto-calculated:{" "}
              <span className="font-semibold text-slate-700">{days}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Food preference</label>
            <select
              value={foodPref}
              onChange={(e) => setFoodPref(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            >
              <option>Any</option>
              <option>Vegetarian</option>
              <option>Vegan</option>
              <option>Eggetarian</option>
              <option>Non-veg</option>
            </select>
          </div>

          <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Interests</label>
              <input
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="beaches, cafes, forts, shopping..."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Must-do</label>
              <input
                value={mustDo}
                onChange={(e) => setMustDo(e.target.value)}
                placeholder="parasailing, sunset point, local market..."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Extra notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="hotel already booked? prefer public transport? any constraints?"
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <button
              disabled={loading || !canGenerate}
              onClick={generate}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                loading || !canGenerate
                  ? "cursor-not-allowed bg-slate-200 text-slate-500"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
              type="button"
            >
              {loading ? "Generating..." : "Generate Itinerary"}
            </button>

            {err ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {err}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Result */}
      {result ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-slate-900">Your Itinerary</h3>
            <p className="text-sm text-slate-600">You can copy or download this plan.</p>
          </div>

          <pre className="mt-4 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
            {result}
          </pre>

          <ExportShare text={result} />
        </div>
      ) : null}

      <div className="mt-6 text-xs text-slate-500">
        API base: <span className="font-mono">{API}</span>
      </div>
    </div>
  );
}
