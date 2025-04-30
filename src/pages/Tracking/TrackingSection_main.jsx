import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Cloud, Wind, Droplet, Thermometer } from 'lucide-react';
import Footer from "../../navigations/Footer/Footer_main";
import NavBar from "../../navigations/NavBar/Navigation_main"


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});



const createTyphoonIcon = (color) => {
  return new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
    className: 'typhoon-marker',
    color: color
  });
};

function PhilippineTyphoonTracker() {
  const [typhoons, setTyphoons] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2023");
  const [selectedTyphoon, setSelectedTyphoon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);


  const weatherApiKey = "b47fba205d86b1e6f7dddfd426314b54";

 
  const years = ["2018", "2019", "2020", "2021", "2022", "2023"];


  const mapCenter = [12.8797, 121.7740]; 
  const mapZoom = 6;

  useEffect(() => {
  
    const fetchTyphoonData = async () => {
      setLoading(true);
      try {
       
        const simulatedData = simulateTyphoonData(selectedYear);
        setTyphoons(simulatedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch typhoon data. Please try again later.");
        setLoading(false);
      }
    };

    fetchTyphoonData();
  }, [selectedYear]);

  // Fetch current weather data when a typhoon is selected
  useEffect(() => {
    if (selectedTyphoon) {
      fetchWeatherData();
    } else {
      setCurrentWeather(null);
    }
  }, [selectedTyphoon]);

  // Function to fetch weather data for selected typhoon's affected areas
  const fetchWeatherData = async () => {
    if (!selectedTyphoon || !selectedTyphoon.affectedAreas || selectedTyphoon.affectedAreas.length === 0) {
      return;
    }

    setWeatherLoading(true);
    try {
      // Using the first affected area as a reference point for weather
      const area = selectedTyphoon.affectedAreas[0] + ", Philippines";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(area)}&units=metric&appid=${weatherApiKey}`
      );

      if (!response.ok) {
        throw new Error('Weather data not available');
      }

      const data = await response.json();
      setCurrentWeather(data);
      setWeatherLoading(false);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setCurrentWeather(null);
      setWeatherLoading(false);
    }
  };

  // Function to simulate typhoon data
  const simulateTyphoonData = (year) => {
    // Sample typhoon data by year
    const typhoonsByYear = {
      2023: [
        {
          id: "egay2023",
          name: "EGAY",
          date: "July 23, 2023",
          category: "Super Typhoon",
          path: [
            [15.2, 120.5],
            [15.5, 119.8],
            [16.0, 119.2],
            [16.8, 118.5],
          ],
          affectedAreas: ["Northern Luzon", "Central Luzon"],
          maxWinds: "175 km/h",
          color: "#ef4444",
          damage: "₱4.2 billion",
          casualties: "17 confirmed deaths",
          description: "Super Typhoon Egay brought intense rainfall and widespread flooding to Northern Luzon."
        },
        {
          id: "chedeng2023",
          name: "CHEDENG",
          date: "June 6, 2023",
          category: "Typhoon",
          path: [
            [12.5, 126.0],
            [13.0, 125.5],
            [13.5, 125.0],
            [14.0, 124.5],
          ],
          affectedAreas: ["Eastern Visayas", "Bicol Region"],
          maxWinds: "140 km/h",
          color: "#f97316",
          damage: "₱1.8 billion",
          casualties: "5 confirmed deaths",
          description: "Typhoon Chedeng caused significant damage in Eastern Visayas with heavy rainfall and storm surges."
        },
        {
          id: "butchoy2023",
          name: "BUTCHOY",
          date: "April 12, 2023",
          category: "Tropical Storm",
          path: [
            [10.2, 127.5],
            [10.8, 127.0],
            [11.5, 126.5],
            [12.3, 126.0],
          ],
          affectedAreas: ["Eastern Visayas", "Caraga"],
          maxWinds: "85 km/h",
          color: "#10b981",
          damage: "₱624 million",
          casualties: "2 confirmed deaths",
          description: "Tropical Storm Butchoy brought moderate rainfall to Eastern Visayas and Caraga regions."
        },
      ],
      2022: [
        {
          id: "florita2022",
          name: "FLORITA",
          date: "August 23, 2022",
          category: "Typhoon",
          path: [
            [14.2, 122.5],
            [14.8, 122.0],
            [15.5, 121.5],
            [16.3, 121.0],
          ],
          affectedAreas: ["Northern Luzon"],
          maxWinds: "150 km/h",
          color: "#f97316",
          damage: "₱2.1 billion",
          casualties: "10 confirmed deaths",
          description: "Typhoon Florita caused significant flooding in Northern Luzon, particularly affecting agricultural areas."
        },
        {
          id: "domeng2022",
          name: "DOMENG",
          date: "July 1, 2022",
          category: "Tropical Storm",
          path: [
            [13.5, 124.0],
            [14.0, 123.5],
            [14.5, 123.0],
            [15.0, 122.5],
          ],
          affectedAreas: ["Eastern Visayas", "Bicol"],
          maxWinds: "95 km/h",
          color: "#10b981",
          damage: "₱548 million",
          casualties: "3 confirmed deaths",
          description: "Tropical Storm Domeng brought moderate rainfall to Eastern Visayas and Bicol regions."
        },
      ],
      2021: [
        {
          id: "odette2021",
          name: "ODETTE",
          date: "December 16, 2021",
          category: "Super Typhoon",
          path: [
            [10.0, 127.0],
            [10.5, 126.0],
            [11.0, 125.0],
            [11.5, 124.0],
          ],
          affectedAreas: ["Caraga", "Central Visayas", "Palawan"],
          maxWinds: "195 km/h",
          color: "#ef4444",
          damage: "₱16.7 billion",
          casualties: "409 confirmed deaths",
          description: "Super Typhoon Odette was one of the strongest typhoons to hit the Philippines in 2021, causing widespread destruction."
        },
        {
          id: "maring2021",
          name: "MARING",
          date: "October 11, 2021",
          category: "Severe Tropical Storm",
          path: [
            [19.2, 121.5],
            [19.8, 121.0],
            [20.5, 120.5],
          ],
          affectedAreas: ["Northern Luzon"],
          maxWinds: "100 km/h",
          color: "#f59e0b",
          damage: "₱1.2 billion",
          casualties: "11 confirmed deaths",
          description: "Severe Tropical Storm Maring brought heavy rainfall to Northern Luzon causing flooding and landslides."
        },
      ],
      2020: [
        {
          id: "ulysses2020",
          name: "ULYSSES",
          date: "November 11, 2020",
          category: "Typhoon",
          path: [
            [14.0, 124.5],
            [14.5, 123.5],
            [15.0, 122.5],
            [15.5, 121.5],
          ],
          affectedAreas: ["Bicol Region", "Central Luzon", "Metro Manila"],
          maxWinds: "155 km/h",
          color: "#f97316",
          damage: "₱20.3 billion",
          casualties: "67 confirmed deaths",
          description: "Typhoon Ulysses caused severe flooding in Metro Manila and surrounding provinces."
        },
        {
          id: "rolly2020",
          name: "ROLLY",
          date: "November 1, 2020",
          category: "Super Typhoon",
          path: [
            [13.0, 125.5],
            [13.5, 124.5],
            [14.0, 123.5],
            [14.5, 122.5],
          ],
          affectedAreas: ["Bicol Region", "CALABARZON"],
          maxWinds: "225 km/h",
          color: "#ef4444",
          damage: "₱20.5 billion",
          casualties: "25 confirmed deaths",
          description: "Super Typhoon Rolly was one of the strongest typhoons to hit the Philippines in 2020, causing extensive damage."
        },
      ],
      2019: [
        {
          id: "tisoy2019",
          name: "TISOY",
          date: "December 2, 2019",
          category: "Typhoon",
          path: [
            [12.5, 125.8],
            [13.0, 125.0],
            [13.5, 124.0],
            [14.0, 123.0],
          ],
          affectedAreas: ["Bicol Region", "CALABARZON", "MIMAROPA"],
          maxWinds: "175 km/h",
          color: "#f97316",
          damage: "₱5.9 billion",
          casualties: "17 confirmed deaths",
          description: "Typhoon Tisoy caused significant damage in Bicol Region and Southern Luzon."
        },
        {
          id: "ursula2019",
          name: "URSULA",
          date: "December 24, 2019",
          category: "Typhoon",
          path: [
            [11.0, 126.5],
            [11.5, 125.5],
            [12.0, 124.5],
            [12.5, 123.5],
          ],
          affectedAreas: ["Eastern Visayas", "Western Visayas"],
          maxWinds: "140 km/h",
          color: "#f97316",
          damage: "₱4.3 billion",
          casualties: "28 confirmed deaths",
          description: "Typhoon Ursula struck the Philippines on Christmas Eve, causing damage in Eastern and Western Visayas."
        },
      ],
      2018: [
        {
          id: "ompong2018",
          name: "OMPONG",
          date: "September 15, 2018",
          category: "Super Typhoon",
          path: [
            [16.0, 124.0],
            [16.5, 123.0],
            [17.0, 122.0],
            [17.5, 121.0],
          ],
          affectedAreas: ["Northern Luzon"],
          maxWinds: "205 km/h",
          color: "#ef4444",
          damage: "₱33.9 billion",
          casualties: "82 confirmed deaths",
          description: "Super Typhoon Ompong was one of the strongest typhoons to hit the Philippines in 2018, causing extensive damage in Northern Luzon."
        },
        {
          id: "rosita2018",
          name: "ROSITA",
          date: "October 30, 2018",
          category: "Typhoon",
          path: [
            [15.5, 125.5],
            [16.0, 124.5],
            [16.5, 123.5],
            [17.0, 122.5],
          ],
          affectedAreas: ["Northern Luzon"],
          maxWinds: "150 km/h",
          color: "#f97316",
          damage: "₱4.9 billion",
          casualties: "27 confirmed deaths",
          description: "Typhoon Rosita caused significant damage in Northern Luzon, particularly in Isabela and Mountain Province."
        },
      ],
    };

    return typhoonsByYear[year] || [];
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedTyphoon(null);
  };

  const handleYearTabClick = (year) => {
    setSelectedYear(year);
    setSelectedTyphoon(null);
  };

  const handleTyphoonSelect = (typhoon) => {
    setSelectedTyphoon(typhoon);
  };

  // Get color based on typhoon category
  const getCategoryColor = (category) => {
    if (category.includes("Super")) return "#ef4444";
    if (category.includes("Typhoon")) return "#f97316";
    if (category.includes("Severe")) return "#f59e0b";
    return "#10b981";
  };

  // Helper function for category class
  const getCategoryClass = (category) => {
    if (category.includes("Super")) return "category-super";
    if (category.includes("Typhoon")) return "category-typhoon";
    if (category.includes("Severe")) return "category-severe";
    return "category-tropical";
  };

  // Weather icon URL builder
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <>
    <div className="typhoon-tracker-container">
      <NavBar />
      <header className="tracker-header">
        <h1>Philippine Typhoon Tracking</h1>
        <div className="year-selector">
          <label htmlFor="year-select">Select Year: </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={handleYearChange}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="tracker-content">
        <div className="map-container">
          <h2>Annual Typhoon Tracks for {selectedYear}</h2>

          <div className="year-tabs">
            {years.map((year) => (
              <button
                key={year}
                className={`year-tab ${selectedYear === year ? "active" : ""}`}
                onClick={() => handleYearTabClick(year)}
              >
                {year}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading">Loading map data...</div>
          ) : (
            <div className="typhoon-map">
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Render all typhoon paths */}
                {typhoons.map((typhoon) => (
                  <Polyline
                    key={typhoon.id}
                    positions={typhoon.path}
                    color={typhoon.color || getCategoryColor(typhoon.category)}
                    weight={
                      selectedTyphoon && selectedTyphoon.id === typhoon.id
                        ? 5
                        : 3
                    }
                    opacity={
                      selectedTyphoon && selectedTyphoon.id === typhoon.id
                        ? 1
                        : 0.7
                    }
                  />
                ))}

                {/* Render markers for the start and end of each typhoon path */}
                {typhoons.map((typhoon) => (
                  <React.Fragment key={`marker-${typhoon.id}`}>
                    <Marker
                      position={typhoon.path[0]}
                      eventHandlers={{
                        click: () => handleTyphoonSelect(typhoon),
                      }}
                    >
                      <Popup>
                        <div
                          style={{ textAlign: "center", fontWeight: "bold" }}
                        >
                          {typhoon.name}
                        </div>
                        <div>Start: {typhoon.date}</div>
                        <div>Category: {typhoon.category}</div>
                        <div>Wind Speed: {typhoon.maxWinds}</div>
                      </Popup>
                    </Marker>
                    <Marker
                      position={typhoon.path[typhoon.path.length - 1]}
                      eventHandlers={{
                        click: () => handleTyphoonSelect(typhoon),
                      }}
                    >
                      <Popup>
                        <div
                          style={{ textAlign: "center", fontWeight: "bold" }}
                        >
                          {typhoon.name}
                        </div>
                        <div>End point</div>
                        <div>Affected: {typhoon.affectedAreas.join(", ")}</div>
                      </Popup>
                    </Marker>
                  </React.Fragment>
                ))}
              </MapContainer>

              <div className="map-legend">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "20px",
                      height: "3px",
                      backgroundColor: "#ef4444",
                    }}
                  ></span>
                  <span style={{ fontSize: "0.8rem" }}>Super Typhoon</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "20px",
                      height: "3px",
                      backgroundColor: "#f97316",
                    }}
                  ></span>
                  <span style={{ fontSize: "0.8rem" }}>Typhoon</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "20px",
                      height: "3px",
                      backgroundColor: "#f59e0b",
                    }}
                  ></span>
                  <span style={{ fontSize: "0.8rem" }}>
                    Severe Tropical Storm
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "20px",
                      height: "3px",
                      backgroundColor: "#10b981",
                    }}
                  ></span>
                  <span style={{ fontSize: "0.8rem" }}>Tropical Storm</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="typhoon-data-container">
          <div className="typhoon-list-container">
            <h2>Typhoons in {selectedYear}</h2>
            {loading ? (
              <div className="loading">Loading typhoon data...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <ul className="typhoon-list">
                {typhoons.length === 0 ? (
                  <li className="no-data">
                    No typhoon data available for this year
                  </li>
                ) : (
                  typhoons.map((typhoon) => (
                    <li
                      key={typhoon.id}
                      className={`typhoon-item ${
                        selectedTyphoon && selectedTyphoon.id === typhoon.id
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => handleTyphoonSelect(typhoon)}
                    >
                      <div>
                        <div className="typhoon-name">{typhoon.name}</div>
                        <div className="typhoon-date">{typhoon.date}</div>
                      </div>
                      <div
                        className={`typhoon-category ${getCategoryClass(
                          typhoon.category
                        )}`}
                      >
                        {typhoon.category.split(" ").slice(-1)[0]}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {selectedTyphoon && (
            <div className="typhoon-details-container">
              <h2>Typhoon Details</h2>
              <div className="typhoon-details">
                <div className="detail-item">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{selectedTyphoon.name}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Date</span>
                  <span className="detail-value">{selectedTyphoon.date}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">
                    {selectedTyphoon.category}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Maximum Wind Speed</span>
                  <span className="detail-value">
                    {selectedTyphoon.maxWinds}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Damage</span>
                  <span className="detail-value">{selectedTyphoon.damage}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Casualties</span>
                  <span className="detail-value">
                    {selectedTyphoon.casualties}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Affected Areas</span>
                  <div className="affected-areas">
                    {selectedTyphoon.affectedAreas.map((area, index) => (
                      <span key={index} className="area-tag">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Description</span>
                  <span className="detail-value">
                    {selectedTyphoon.description}
                  </span>
                </div>

                {/* Current Weather Section */}
                {weatherLoading ? (
                  <div className="loading">Loading weather data...</div>
                ) : currentWeather ? (
                  <div className="current-weather">
                    <div className="weather-header">
                      <span className="detail-label">
                        Current Weather in {selectedTyphoon.affectedAreas[0]}
                      </span>
                      <img
                        src={getWeatherIconUrl(currentWeather.weather[0].icon)}
                        alt={currentWeather.weather[0].description}
                        className="weather-icon"
                      />
                    </div>

                    <div className="weather-details">
                      <div className="weather-item">
                        <Thermometer size={16} />
                        <span>{Math.round(currentWeather.main.temp)}°C</span>
                      </div>

                      <div className="weather-item">
                        <Wind size={16} />
                        <span>
                          {Math.round(currentWeather.wind.speed * 3.6)} km/h
                        </span>
                      </div>

                      <div className="weather-item">
                        <Droplet size={16} />
                        <span>{currentWeather.main.humidity}%</span>
                      </div>

                      <div className="weather-item">
                        <Cloud size={16} />
                        <span>{currentWeather.weather[0].description}</span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>

        <div className="typhoon-grid">
          {!loading &&
            typhoons.map((typhoon) => (
              <div
                key={typhoon.id}
                className={`typhoon-card ${
                  selectedTyphoon && selectedTyphoon.id === typhoon.id
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleTyphoonSelect(typhoon)}
                style={{
                  border:
                    selectedTyphoon && selectedTyphoon.id === typhoon.id
                      ? `2px solid ${getCategoryColor(typhoon.category)}`
                      : "1px solid #e2e8f0",
                }}
              >
                <div className="card-header">
                  <div className="card-name">{typhoon.name}</div>
                  <div
                    className={`card-category ${getCategoryClass(
                      typhoon.category
                    )}`}
                  >
                    {typhoon.category.split(" ").slice(-1)[0]}
                  </div>
                </div>

                <div className="card-map">
                  {/* Mini map visualization */}
                  <div
                    style={{
                      height: "100%",
                      backgroundColor: "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Path visualization */}
                    <svg
                      width="100%"
                      height="100%"
                      style={{ position: "absolute", top: 0, left: 0 }}
                    >
                      <path
                        d={`M ${30 + Math.random() * 20} ${
                          80 + Math.random() * 20
                        } 
                          C ${50 + Math.random() * 40} ${
                          60 + Math.random() * 30
                        }, 
                            ${80 + Math.random() * 40} ${
                          50 + Math.random() * 30
                        }, 
                            ${100 + Math.random() * 20} ${
                          30 + Math.random() * 20
                        }`}
                        stroke={
                          typhoon.color || getCategoryColor(typhoon.category)
                        }
                        strokeWidth="3"
                        fill="none"
                      />
                    </svg>
                    <div className="mini-path-label">Path visualization</div>
                  </div>
                </div>

                <div className="card-info">
                  <div className="card-detail">
                    <span className="detail-item-label">Date:</span>
                    <span className="detail-item-value">{typhoon.date}</span>
                  </div>
                  <div className="card-detail">
                    <span className="detail-item-label">Max Winds:</span>
                    <span className="detail-item-value">
                      {typhoon.maxWinds}
                    </span>
                  </div>
                  <div className="card-detail">
                    <span className="detail-item-label">Damage:</span>
                    <span className="detail-item-value">{typhoon.damage}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
    <Footer/>
    </>
  );
}

export default PhilippineTyphoonTracker;