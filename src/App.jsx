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

  // ✅ NEW: store itinerary text
  const [itineraryText, setItineraryText] = useState(() => {
    return localStorage.getItem("itinerary_text_v1") || "";
  });

  // ✅ Better initial step:
  // - if rules exist -> start at summary
  // - else -> rules
  const [step, setStep] = useState(() => {
    const hasRules = !!localStorage.getItem("trip_rules_v1");
    return hasRules ? "summary" : "rules";
  });
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

          // reset itinerary when rules change
          setItineraryText("");
          localStorage.removeItem("itinerary_text_v1");

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
        onEdit={() => {
          setRules(null);
          localStorage.removeItem("trip_rules_v1");

          setItineraryText("");
          localStorage.removeItem("itinerary_text_v1");

          setStep("rules");
        }}
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
        // ✅ IMPORTANT: receive itinerary text here
        onNext={(text) => {
          const safeText = text || "";
          setItineraryText(safeText);
          localStorage.setItem("itinerary_text_v1", safeText);
          setStep("export");
        }}
      />
    );
  }

  // Step 5: Export / Share
  return (
    <ExportShare
      rules={rules}
      itineraryText={itineraryText}
      onBack={() => setStep("itinerary")}
    />
  );
}
