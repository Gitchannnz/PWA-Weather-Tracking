import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { icon, divIcon } from "leaflet";

const AboutTropicalCyclones = () => {
  const [userMarkers, setUserMarkers] = useState([]);
  const [loading, setLoading] = useState(false);

  const philippinesCenter = [12.8797, 121.774];
  const apiKey = "b47fba205d86b1e6f7dddfd426314b54"; // Your API key

  // Default marker icon
  const customIcon = icon({
    iconUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  // Typhoon animated icon as a divIcon with CSS animation
  const customTyphoonIcon = divIcon({
    className: "typhoon-icon",
    html: `<div class="typhoon-marker"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });

  // Fetch weather data for clicked location
  const fetchWeather = async (lat, lon) => {
    if (!apiKey) return;

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
    }
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    fetchWeather(lat, lng);
  };

  useEffect(() => {
    // Could add periodic updates here if desired
    const intervalId = setInterval(() => {
      setLoading(true);
      setLoading(false);
    }, 600000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="about-container">
      <h1 className="about-title">Real Time Philippine Typhoon Monitoring</h1>

      <div className="map-controls">
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
          {/* Base Map */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Live Cloud Overlay */}
          <TileLayer
            url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`}
            attribution="&copy; OpenWeatherMap"
          />

          {/* Live Precipitation Overlay */}
          <TileLayer
            url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`}
            attribution="&copy; OpenWeatherMap"
          />

          {/* Live Wind Animation Overlay */}
          <TileLayer
            url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`}
            attribution="&copy; OpenWeatherMap"
          />

          {/* User Click Weather Markers */}
          {userMarkers.map((marker) => {
            // Detect if wind speed indicates typhoon (≥32 m/s)
            const windSpeed = marker.weather.wind.speed;
            const isTyphoon = windSpeed >= 32;

            return (
              <Marker
                key={marker.id}
                position={marker.position}
                icon={isTyphoon ? customTyphoonIcon : customIcon}
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
                        <p>Wind: {windSpeed} m/s</p>
                        {isTyphoon && (
                          <p style={{ color: "red", fontWeight: "bold" }}>
                            ⚠️ Typhoon Detected!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* The rest of your content remains unchanged */}
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
                <b>ITCZ:</b> Intertropical Convergence Zone - frequent rainfall
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
