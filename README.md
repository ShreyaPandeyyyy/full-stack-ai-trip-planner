# Full-Stack AI Trip Planner ✈️🤖

A production-ready **full-stack travel itinerary generator** that creates smart, day-wise travel plans based on user preferences like destination, dates, budget, pace, interests, and food choices.

🔗 **Live App (Frontend)**  
https://full-stack-ai-trip-planner-tau.vercel.app

🔗 **Live API (Backend)**  
https://full-stack-ai-trip-planner-gien.onrender.com

---

## 🚀 Features

- Day-wise itinerary generation (Morning / Afternoon / Evening)
- Supports **Personal Travel** and **Team / Company Travel**
- Budget-aware planning with cost split
- Food recommendations & packing checklist
- Clean, responsive UI
- Fully deployed frontend + backend
- Environment-based configuration (Vercel + Render)

---

## 🧠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- JavaScript (ES6+)
- Deployed on **Vercel**

### Backend
- Node.js
- Express.js
- CORS + Environment Config
- Deployed on **Render**

---

## 📁 Project Structure
full-stack-ai-trip-planner/
│
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
│
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   └── components/
│       ├── ItineraryGenerator.jsx
│       └── ExportShare.jsx
│
└── server/
    ├── server.js
    └── package.json

---

## 🔌 API Details

### Health Check

GET /

### Response:
```json
{
  "status": "ok",
  "message": "Backend is running 🚀",
  "endpoints": {
    "itinerary": "POST /api/itinerary"
  }
}
```

### Generate Itinerary

POST /api/itinerary

### Request Body:
```json
{
  "prompt": "AI prompt text",
  "meta": {
    "destination": "Goa",
    "days": 3,
    "peopleCount": 2,
    "budget": 25000,
    "pace": "Balanced",
    "foodPref": "Any",
    "interests": "beaches, cafes",
    "mustDo": "sunset point",
    "notes": "prefer relaxed travel"
  }
}
```

### Response:
```json
{
  "itinerary": "Day 1:\nMorning: ...\nAfternoon: ...\nEvening: ...\n\nDay 2: ..."
}
```

## ⚙️ Environment Variables
### Frontend (Vercel)
VITE_API_BASE=https://full-stack-ai-trip-planner-gien.onrender.com

### Backend (Render)
```
PORT=5000
FRONTEND_URL=https://full-stack-ai-trip-planner-tau.vercel.app
```

---

## ▶️ Run Locally
### 1️⃣ Clone the Repository
```
git clone https://github.com/ShreyaPandeyyyy/full-stack-ai-trip-planner.git
cd full-stack-ai-trip-planner
```

### 2️⃣ Start Backend
```
cd server
npm install
npm run dev
```

Backend runs at:
http://localhost:5000

### 3️⃣ Start Frontend
```
cd ..
npm install
npm run dev
```

Frontend runs at:
http://localhost:5173

---

## 🧪 Testing
- Open frontend → fill trip details → click Generate Itinerary

- Backend health check:
  https://full-stack-ai-trip-planner-gien.onrender.com/

- API tested via browser, Postman, and frontend integration

---

## 🧑‍💻 Author
B.E. Electronics & Communication Engineering
BMS College of Engineering (2022–2026)

GitHub: https://github.com/ShreyaPandeyyyy

LinkedIn: https://www.linkedin.com/in/shreya-pandey-/

---

## 📝 Notes

- Backend is intentionally lightweight (demo AI logic)
- Easily extendable with LLM APIs (Gemini / OpenAI)
- Designed to showcase system design, API design, and deployment
- Suitable for internships, interviews, and portfolio projects

---
