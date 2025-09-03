import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

// Use the port provided by Render or fallback to 5000
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.WEATHER_API_KEY;

// Root route to confirm backend is running
app.get("/", (req, res) => {
  res.send("Weather App Backend is running!");
});

// Weather API route
app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (err) {
    console.error("Weather fetch error:", err.response?.data || err.message);
    if (err.response?.status === 404) {
      res.status(404).json({ error: "City not found" });
    } else {
      res.status(500).json({ error: "Server error. Please try again later." });
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
