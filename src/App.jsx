import { useState } from "react";
import IcpGate from "./components/IcpGate";
import TripRules from "./components/TripRules";
import RulesSummary from "./components/RulesSummary.jsx";
import ItineraryGenerator from "./components/ItineraryGenerator";
import ExportShare from "./components/ExportShare";

export default function App() {
  const [icp, setIcp] = useState(() => localStorage.getItem("icp") || "");
  const [rules, setRules] = useState(() => {
    const saved = localStorage.getItem("trip_rules_v1");
    return saved ? JSON.parse(saved) : null;
  });

  const [step, setStep] = useState("rules"); 
  // rules → summary → itinerary → export

  const handleIcpSelect = (value) => {
    setIcp(value);
    localStorage.setItem("icp", value);
  };

  // Step 1: ICP Gate
  if (!icp) {
    return <IcpGate onSelect={handleIcpSelect} />;
  }

  // Step 2: Trip Rules
  if (!rules) {
    return (
      <TripRules
        icp={icp}
        onContinue={(r) => {
          setRules(r);
          localStorage.setItem("trip_rules_v1", JSON.stringify(r));
          setStep("summary");
        }}
      />
    );
  }

  // Step 3: Rules Summary
  if (step === "summary") {
    return (
      <RulesSummary
        rules={rules}
        onEdit={() => setRules(null)}
        onGenerate={() => setStep("itinerary")}
      />
    );
  }

  // Step 4: Itinerary Generator
  if (step === "itinerary") {
    return (
      <ItineraryGenerator
        icp={icp}
        rules={rules}
        onBack={() => setStep("summary")}
        onNext={() => setStep("export")}
      />
    );
  }

  // Step 5: Export / Share
  return (
    <ExportShare
      rules={rules}
      onBack={() => setStep("itinerary")}
    />
  );
}
