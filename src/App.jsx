import { useState } from "react";
import IcpGate from "./components/IcpGate";

function App() {
  // ICP state (team vs personal)
  const [icp, setIcp] = useState(() => localStorage.getItem("icp") || "");

  // demo state (will be removed later, kept for now)
  const [count, setCount] = useState(0);

  const handleIcpSelect = (value) => {
    setIcp(value);
    localStorage.setItem("icp", value);
  };

  // 🔒 ICP Gate always comes first
  if (!icp) {
    return <IcpGate onSelect={handleIcpSelect} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <p className="text-sm text-slate-400">Team Travel Planner</p>
          <h1 className="text-3xl font-semibold mt-2">
            Plan business trips with clarity
          </h1>
          <p className="text-slate-300 mt-3 max-w-2xl">
            This product is optimized for company and team travel workflows —
            budgets, constraints, and shareable itineraries.
          </p>
        </header>

        {/* Temporary content (will evolve into Trip Rules) */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">
            Demo Area (next: Trip Rules)
          </h2>

          <button
            onClick={() => setCount((c) => c + 1)}
            className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition"
          >
            Clicked {count} times
          </button>

          <p className="text-slate-400 text-sm mt-4">
            This section will be replaced with non-negotiable trip rules
            (budget, team size, dates, constraints).
          </p>
        </section>
      </div>
    </div>
  );
}

export default App;
