import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const Weather = () => {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city");
      setData(null);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/weather?city=${city}`
      );
      setData(res.data);
      setError("");
    } catch {
      setError("City not found or server error");
      setData(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Weather App</h1>

      <div className="flex items-center justify-center mb-4">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={fetchWeather}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Get Weather
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {data && (
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-xl font-semibold mb-2">{data.name}, {data.sys.country}</h2>
          <p>🌡️ {data.main.temp} °C</p>
          <p>☁️ {data.weather[0].description}</p>
          <p>💨 Wind: {data.wind.speed} m/s</p>

          <div className="mt-4 h-80 w-full">
            <MapContainer
              center={[data.coord.lat, data.coord.lon]}
              zoom={10}
              scrollWheelZoom={false}
              className="h-full w-full"
              key={`${data.coord.lat}-${data.coord.lon}`} // ensures map updates for new city
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[data.coord.lat, data.coord.lon]}>
                <Popup>{data.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
