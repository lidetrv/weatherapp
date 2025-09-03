import React from "react";
import Weather from "./components/Weather";

function App() {
  return (
    <div style={{ fontFamily: "Arial", textAlign: "center", marginTop: "50px" }}>
      <h1>🌤️ Weather App</h1>
      <Weather />
    </div>
  );
}

export default App;
