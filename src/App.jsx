import { useState } from "react";
import IcpGate from "./components/IcpGate";
import TripRules from "./components/TripRules";
import RulesSummary from "./components/RulesSummary";

export default function App() {
  const [icp, setIcp] = useState(() => localStorage.getItem("icp") || "");
  const [rules, setRules] = useState(null);

  const handleIcpSelect = (value) => {
    setIcp(value);
    localStorage.setItem("icp", value);
  };

  // Step 1: ICP Gate
  if (!icp) {
    return <IcpGate onSelect={handleIcpSelect} />;
  }

  // Step 2: Trip Rules (non-negotiables)
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

  // Step 3: Rules Summary (confirmation before generation)
  return (
    <RulesSummary
      rules={rules}
      onEdit={() => setRules(null)}
      onGenerate={() => {
        alert("Next step: itinerary generation (to be implemented)");
      }}
    />
  );
}
