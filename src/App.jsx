import { useState } from "react";
import IcpGate from "./components/IcpGate";
import TripRules from "./components/TripRules";
import RulesSummary from "./components/RulesSummary.jsx";
import ItineraryGenerator from "./components/ItineraryGenerator";

export default function App() {
  const [icp, setIcp] = useState(() => localStorage.getItem("icp") || "");
  const [rules, setRules] = useState(() => {
    const saved = localStorage.getItem("trip_rules_v1");
    return saved ? JSON.parse(saved) : null;
  });
  const [showGen, setShowGen] = useState(false);

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
          setShowGen(false); // reset generator state on new rules
        }}
      />
    );
  }

  // Step 3: Rules Summary (confirmation before generation)
  if (!showGen) {
    return (
      <RulesSummary
        rules={rules}
        onEdit={() => setRules(null)}
        onGenerate={() => setShowGen(true)}
      />
    );
  }

  // Step 4: Itinerary Generation (day-wise)
  return (
    <ItineraryGenerator
      icp={icp}
      rules={rules}
      onBack={() => setShowGen(false)}
    />
  );
}
