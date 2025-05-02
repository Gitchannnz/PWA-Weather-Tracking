import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { icon } from "leaflet";

const AboutTropicalCyclones = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [activeCyclones, setActiveCyclones] = useState([]);
  const [userMarkers, setUserMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const philippinesCenter = [12.8797, 121.774];

  const customIcon = icon({
    iconUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const fetchActiveCyclones = async () => {
    setLoading(true);
    try {
      const sampleCyclones = [
        {
          id: 1,
          name: "Typhoon Ambo",
          position: [10.5, 126.3],
          category: "Typhoon",
          windSpeed: 150,
          pressure: 960,
          movement: "NW at 15 km/h",
        },
        {
          id: 2,
          name: "Tropical Storm Butchoy",
          position: [16.2, 123.1],
          category: "Tropical Storm",
          windSpeed: 85,
          pressure: 990,
          movement: "N at 12 km/h",
        },
        {
          id: 3,
          name: "Tropical Depression",
          position: [8.1, 119.5],
          category: "Tropical Depression",
          windSpeed: 55,
          pressure: 1002,
          movement: "W at 10 km/h",
        },
      ];

      setActiveCyclones(sampleCyclones);
    } catch (err) {
      console.error("Failed to fetch cyclone data:", err);
      setError("Failed to load cyclone data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (lat, lon) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    if (!apiKey) {
      console.error("❌ VITE_WEATHER_API_KEY is missing from .env");
      setError("Missing API key.");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );

      const newMarker = {
        id: Date.now(),
        position: [lat, lon],
        weather: response.data,
      };

      setUserMarkers((prev) => [...prev, newMarker]);
    } catch (err) {
      console.error("❌ Weather fetch failed:", err);
      setError("Failed to fetch weather.");
    }
  };

  const getCycloneColor = (category) => {
    switch (category) {
      case "Super Typhoon":
        return "#ff0000";
      case "Typhoon":
        return "#ff6600";
      case "Severe Tropical Storm":
        return "#ffcc00";
      case "Tropical Storm":
        return "#00cc00";
      case "Tropical Depression":
        return "#0066ff";
      default:
        return "#663399";
    }
  };

  const getCycloneRadius = (windSpeed) => {
    return Math.min(Math.max(windSpeed / 10, 10), 50);
  };

  useEffect(() => {
    fetchActiveCyclones();
    const intervalId = setInterval(fetchActiveCyclones, 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    fetchWeather(lat, lng);
  };

  return (
    <div className="about-container">
      <h1 className="about-title">Philippine Typhoon Monitoring</h1>

      <div className="map-controls">
        {/* <button className="control-button" onClick={() => setUserMarkers([])}>
          Clear User Markers
        </button>
        <button className="control-button" onClick={fetchActiveCyclones}>
          Refresh Cyclone Data
        </button> */}
        {loading && <span className="loading-indicator">Loading...</span>}
      </div>

      <div className="map-container">
        <MapContainer
          center={philippinesCenter}
          zoom={6}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "500px" }}
          onClick={handleMapClick}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {activeCyclones.map((cyclone) => (
            <React.Fragment key={cyclone.id}>
              <CircleMarker
                center={cyclone.position}
                radius={getCycloneRadius(cyclone.windSpeed)}
                pathOptions={{
                  color: getCycloneColor(cyclone.category),
                  fillColor: getCycloneColor(cyclone.category),
                  fillOpacity: 0.4,
                }}
              >
                <Popup>
                  <div className="cyclone-popup">
                    <h3>{cyclone.name}</h3>
                    <p>
                      <strong>Category:</strong> {cyclone.category}
                    </p>
                    <p>
                      <strong>Wind Speed:</strong> {cyclone.windSpeed} km/h
                    </p>
                    <p>
                      <strong>Pressure:</strong> {cyclone.pressure} hPa
                    </p>
                    <p>
                      <strong>Movement:</strong> {cyclone.movement}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          ))}

          {userMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={customIcon}
            >
              <Popup>
                <div className="weather-popup">
                  <h3>Weather at {marker.weather.name}</h3>
                  <div className="weather-details">
                    <img
                      src={`https://openweathermap.org/img/wn/${marker.weather.weather[0].icon}@2x.png`}
                      alt="Weather icon"
                    />
                    <div className="weather-data">
                      <p className="temp">
                        {Math.round(marker.weather.main.temp)}°C
                      </p>
                      <p className="desc">
                        {marker.weather.weather[0].description}
                      </p>
                      <p>Humidity: {marker.weather.main.humidity}%</p>
                      <p>Wind: {marker.weather.wind.speed} m/s</p>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="two-column-section">
        <div className="column">
          <div className="info-box">
            <h3>About Tropical Cyclones</h3>
            <p>
              Tropical cyclones are warm-core low pressure systems with spiral
              inflow at the bottom level and spiral outflow at the top. They
              form over oceans with surface temperatures above 26°C, collecting
              heat and moisture to fuel powerful weather systems.
            </p>
          </div>

          <div className="regional-names">
            <h3>Philippine Weather Terms</h3>
            <ul className="region-list">
              <li>
                <b>Bagyo:</b> General term for a tropical cyclone.
              </li>
              <li>
                <b>LPA (Low Pressure Area):</b> Potential origin of a cyclone.
              </li>
              <li>
                <b>ITCZ:</b> Intertropical Convergence Zone — frequent rainfall
                area.
              </li>
              <li>
                <b>Habagat:</b> Southwest Monsoon, brings heavy rain (Jun–Sep).
              </li>
              <li>
                <b>Amihan:</b> Northeast Monsoon, cool dry wind (Nov–Feb).
              </li>
            </ul>
          </div>
        </div>

        <div className="column">
          <div className="impact-box">
            <div className="warning-icon">
              <svg width="24" height="24" fill="#f59e0b">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </div>
            <h3 className="impact-title">Impact on the Philippines</h3>
            <p className="impact-text">
              The Philippines experiences an average of 20 tropical cyclones
              yearly, with about 8-9 making landfall. These storms cause
              flooding, landslides, and storm surges that affect millions of
              Filipinos annually. The country's location in the Pacific typhoon
              belt makes it particularly vulnerable.
            </p>
          </div>

          <div className="categories-section">
            <h3>Cyclone Categories in the Philippines</h3>
            <ul className="category-list">
              <li>
                <span
                  className="category-dot super-typhoon"
                  style={{ backgroundColor: "#ff0000" }}
                ></span>{" "}
                <strong>Super Typhoon:</strong> &gt;185 km/h sustained winds
              </li>
              <li>
                <span
                  className="category-dot typhoon"
                  style={{ backgroundColor: "#ff6600" }}
                ></span>{" "}
                <strong>Typhoon:</strong> 118–185 km/h sustained winds
              </li>
              <li>
                <span
                  className="category-dot severe-storm"
                  style={{ backgroundColor: "#ffcc00" }}
                ></span>{" "}
                <strong>Severe Tropical Storm:</strong> 89–117 km/h
              </li>
              <li>
                <span
                  className="category-dot storm"
                  style={{ backgroundColor: "#00cc00" }}
                ></span>{" "}
                <strong>Tropical Storm:</strong> 62–88 km/h
              </li>
              <li>
                <span
                  className="category-dot depression"
                  style={{ backgroundColor: "#0066ff" }}
                ></span>{" "}
                <strong>Tropical Depression:</strong> {"<"}62 km/h
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTropicalCyclones;
