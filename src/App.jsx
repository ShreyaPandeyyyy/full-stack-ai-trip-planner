import { useState } from "react";
import IcpGate from "./components/IcpGate";
import TripRules from "./components/TripRules";

export default function App() {
  const [icp, setIcp] = useState(() => localStorage.getItem("icp") || "");
  const [rules, setRules] = useState(null);

  const handleIcpSelect = (value) => {
    setIcp(value);
    localStorage.setItem("icp", value);
  };

  if (!icp) return <IcpGate onSelect={handleIcpSelect} />;

  if (!rules) {
    return (
      <TripRules
        icp={icp}
        onContinue={(r) => {
          setRules(r);
          localStorage.setItem("trip_rules_v1", JSON.stringify(r));
        }}
      />
    );
  }

  // Next step placeholder (we’ll implement itinerary generation next)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm text-slate-400">Step 2 of 3</p>
        <h1 className="text-3xl font-semibold mt-2">Generate itinerary</h1>
        <p className="text-slate-300 mt-3">
          Trip rules saved. Next, we’ll generate an itinerary that respects these constraints.
        </p>

        <pre className="mt-6 text-xs bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-auto">
{JSON.stringify(rules, null, 2)}
        </pre>

        <button
          onClick={() => setRules(null)}
          className="mt-6 rounded-lg border border-slate-800 px-4 py-2 text-sm hover:bg-slate-900 transition"
        >
          Edit Trip Rules
        </button>
      </div>
    </div>
  );
}
