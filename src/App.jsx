// src/App.jsx
import { useEffect, useState } from "react";
import ItineraryGenerator from "./components/ItineraryGenerator";

export default function App() {
  const [apiBase, setApiBase] = useState("");

  useEffect(() => {
    setApiBase(import.meta.env.VITE_API_BASE || "");
  }, []);

  return (
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

      <main style={{ marginTop: 24 }}>
        {/* SAFETY CHECK */}
        {ItineraryGenerator ? (
          <ItineraryGenerator />
        ) : (
          <p>ItineraryGenerator component not found.</p>
        )}
      </main>

      <footer style={{ marginTop: 32, fontSize: 12, opacity: 0.7 }}>
        Tip: In local dev, create a <code>.env</code> with{" "}
        <code>VITE_API_BASE=http://localhost:5000</code>
      </footer>
    </div>
  );
}
