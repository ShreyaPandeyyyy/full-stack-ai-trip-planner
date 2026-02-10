const express = require("express");
const cors = require("cors");

const app = express();

// allow localhost + your vercel domain (we'll set FRONTEND_URL on Render later)
app.use(
  cors({
    origin: (origin, cb) => {
      const allowed = [
        process.env.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
      ].filter(Boolean);

      if (!origin) return cb(null, true); // postman/curl
      if (allowed.includes(origin)) return cb(null, true);
      return cb(new Error("CORS blocked: " + origin));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Backend is running ✅" });
});

app.post("/api/itinerary", (req, res) => {
  const { meta } = req.body || {};

  const destination = meta?.destination || "your destination";
  const days = meta?.days || 3;
  const pace = meta?.pace || "Balanced";
  const budget = meta?.budget ? `₹${meta.budget}` : "Not specified";

  let text = `Trip Itinerary (Demo Backend)\n\n`;
  for (let i = 1; i <= days; i++) {
    text += `Day ${i}:\n`;
    text += `  Morning: Local sightseeing near ${destination}\n`;
    text += `  Afternoon: Food + explore markets (pace: ${pace})\n`;
    text += `  Evening: Relax + try a local restaurant\n\n`;
  }

  text += `Packing checklist:\n- ID, cash, charger, meds, comfortable shoes\n\n`;
  text += `Budget summary:\n- Total budget: ${budget}\n- Tip: Split across stay, food, commute, activities\n`;

  return res.json({ itinerary: text });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
