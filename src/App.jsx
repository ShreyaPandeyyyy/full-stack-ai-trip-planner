// src/App.jsx
import { useEffect, useState } from "react";

import IcpGate from "./components/IcpGate";
import TripRules from "./components/TripRules";
import RulesSummary from "./components/RulesSummary.jsx";
import ItineraryGenerator from "./components/ItineraryGenerator";
import ExportShare from "./components/ExportShare";

export default function App() {
  const [apiBase, setApiBase] = useState("");

  useEffect(() => {
    setApiBase(import.meta.env.VITE_API_BASE || "");
  }, []);

  const [icp, setIcp] = useState(() => localStorage.getItem("icp") || "");

  const [rules, setRules] = useState(() => {
    const saved = localStorage.getItem("trip_rules_v1");
    return saved ? JSON.parse(saved) : null;
  });

  // store itinerary text
  const [itineraryText, setItineraryText] = useState(() => {
    return localStorage.getItem("itinerary_text_v1") || "";
  });

  // rules → summary → itinerary → export
  const [step, setStep] = useState(() => {
    const hasRules = !!localStorage.getItem("trip_rules_v1");
    return hasRules ? "summary" : "rules";
  });

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
    <>
      <div
        style={{
          fontFamily: "system-ui",
          padding: 24,
          maxWidth: 900,
          margin: "0 auto",
          lineHeight: 1.5,
        }}
      >
        <header style={{ marginBottom: 16 }}>
          <h1 style={{ margin: 0 }}>Full-Stack AI Trip Planner</h1>
          <p style={{ marginTop: 6, opacity: 0.85 }}>
            Deployed on Vercel ✅{" "}
            {apiBase ? (
              <span style={{ fontSize: 12 }}>(API: {apiBase})</span>
            ) : (
              <span style={{ fontSize: 12 }}>
                (Set VITE_API_BASE in .env / Vercel)
              </span>
            )}
          </p>
        </header>

        <ExportShare
          rules={rules}
          itineraryText={itineraryText}
          onBack={() => setStep("itinerary")}
        />

        <footer style={{ marginTop: 32, fontSize: 12, opacity: 0.7 }}>
          Tip: In local dev, create a <code>.env</code> with{" "}
          <code>VITE_API_BASE=http://localhost:5000</code>
        </footer>
      </div>
    </>
  );
}
