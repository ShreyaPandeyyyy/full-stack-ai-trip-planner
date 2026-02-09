// src/components/ItineraryGenerator.jsx
import { useState } from "react";

export default function ItineraryGenerator() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);

  return (
    <div
      style={{
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 12,
        marginTop: 16,
      }}
    >
      <h2>Generate Your Trip Itinerary</h2>

      <div style={{ marginBottom: 12 }}>
        <label>Destination</label>
        <br />
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g. Goa"
          style={{ padding: 8, width: "100%", marginTop: 4 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Number of days</label>
        <br />
        <input
          type="number"
          min={1}
          value={days}
          onChange={(e) => setDays(e.target.value)}
          style={{ padding: 8, width: "100%", marginTop: 4 }}
        />
      </div>

      <button
        style={{
          padding: "8px 16px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
        }}
      >
        Generate Itinerary
      </button>
    </div>
  );
}
