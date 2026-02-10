const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/**
 * CORS setup
 * - Allows localhost for development
 * - Allows your Vercel frontend via FRONTEND_URL (set on Render)
 */
app.use(
  cors({
    origin: (origin, cb) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL, // Vercel frontend
        "http://localhost:5173",  // Vite
        "http://localhost:3000",  // CRA / Next
      ].filter(Boolean);

      // allow Postman / curl / server-to-server
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) {
        return cb(null, true);
      }

      return cb(new Error("CORS blocked: " + origin));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

/**
 * ✅ Health check / root route
 * This fixes the Render "Not Found" issue
 */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running 🚀",
    endpoints: {
      itinerary: "POST /api/itinerary",
    },
  });
});

/**
 * ✅ Demo Itinerary API
 * This matches your frontend expectations
 */
app.post("/api/itinerary", (req, res) => {
  const { meta } = req.body || {};

  const destination = meta?.destination || "your destination";
  const days = Number(meta?.days) || 3;
  const pace = meta?.pace || "Balanced";
  const budget = meta?.budget ? `₹${meta.budget}` : "Not specified";

  let text = `Trip Itinerary (Demo Backend)\n\n`;

  for (let i = 1; i <= days; i++) {
    text += `Day ${i}:\n`;
    text += `  Morning: Local sightseeing near ${destination}\n`;
    text += `  Afternoon: Food + explore markets (pace: ${pace})\n`;
    text += `  Evening: Relax + try a local restaurant\n\n`;
  }

  text += `Packing checklist:\n`;
  text += `- ID\n- Cash / Card\n- Charger\n- Medicines\n- Comfortable shoes\n\n`;

  text += `Budget summary:\n`;
  text += `- Total budget: ${budget}\n`;
  text += `- Tip: Split across stay, food, commute, and activities\n`;

  return res.json({ itinerary: text });
});

/**
 * ✅ Render requires PORT from env
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
