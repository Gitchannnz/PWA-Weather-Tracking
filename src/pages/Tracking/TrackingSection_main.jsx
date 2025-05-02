import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Cloud, Wind, Droplet, Thermometer } from "lucide-react";
import Footer from "../../navigations/Footer/Footer_main";
import NavBar from "../../navigations/NavBar/Navigation_main";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// Initialize Firebase safely
const firebaseConfig = {
  apiKey: "b47fba205d86b1e6f7dddfd426314b54",
  authDomain: "pwa-weather-fc152.firebaseapp.com",
  projectId: "pwa-weather-fc152",
  storageBucket: "pwa-weather-fc152.appspot.com",
  messagingSenderId: "961887500010",
  appId: "1:961887500010:web:dff8c480df5fb833cc8993",
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const db = getFirestore(app);

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const createTyphoonIcon = (color) => {
  return new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
    className: "typhoon-marker",
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
  const mapCenter = [12.8797, 121.774];
  const mapZoom = 6;

  // Fetch typhoon data from Firebase or fallback to simulated data
  useEffect(() => {
    const fetchTyphoonData = async () => {
      setLoading(true);
      try {
        const typhoonData = await fetchTyphoonDataFromFirebase(selectedYear);

        if (typhoonData.length === 0) {
          const simulatedData = simulateTyphoonData(selectedYear);
          setTyphoons(simulatedData);
        } else {
          setTyphoons(typhoonData);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching typhoon data:", err);
        const simulatedData = simulateTyphoonData(selectedYear);
        setTyphoons(simulatedData);
        setError(
          "Failed to fetch typhoon data from database. Using simulated data."
        );
        setLoading(false);
      }
    };

    fetchTyphoonData();
  }, [selectedYear]);

  // Function to fetch typhoon data from Firebase
  const fetchTyphoonDataFromFirebase = async (year) => {
    try {
      const typhoonRef = collection(db, "typhoons");
      const q = query(typhoonRef, where("year", "==", year));
      const querySnapshot = await getDocs(q);

      const typhoonData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        typhoonData.push({
          id: doc.id,
          name: data.name,
          date: data.date,
          category: data.category,
          path: data.path,
          affectedAreas: data.affectedAreas,
          maxWinds: data.maxWinds,
          color: data.color,
          description: data.description,
        });
      });

      return typhoonData;
    } catch (error) {
      console.error("Error fetching from Firebase:", error);
      return [];
    }
  };

  // Fetch current weather data when a typhoon is selected
  useEffect(() => {
    if (selectedTyphoon) {
      fetchWeatherData();
    } else {
      setCurrentWeather(null);
    }
    // eslint-disable-next-line
  }, [selectedTyphoon]);

  // Function to fetch weather data for selected typhoon's affected areas
  const fetchWeatherData = async () => {
    if (
      !selectedTyphoon ||
      !selectedTyphoon.affectedAreas ||
      selectedTyphoon.affectedAreas.length === 0
    ) {
      return;
    }

    setWeatherLoading(true);
    try {
      // Using the first affected area as a reference point for weather
      const area = selectedTyphoon.affectedAreas[0] + ", Philippines";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          area
        )}&units=metric&appid=${weatherApiKey}`
      );

      if (!response.ok) {
        throw new Error("Weather data not available");
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

  // Function to simulate typhoon data for fallback
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
          description:
            "Super Typhoon Egay brought intense rainfall and widespread flooding to Northern Luzon.",
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
          description:
            "Typhoon Chedeng caused significant damage in Eastern Visayas with heavy rainfall and storm surges.",
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
          description:
            "Tropical Storm Butchoy brought moderate rainfall to Eastern Visayas and Caraga regions.",
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
          description:
            "Typhoon Florita caused significant flooding in Northern Luzon, particularly affecting agricultural areas.",
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
          description:
            "Tropical Storm Domeng brought moderate rainfall to Eastern Visayas and Bicol regions.",
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
          description:
            "Super Typhoon Odette was one of the strongest typhoons to hit the Philippines in 2021, causing widespread destruction.",
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
          description:
            "Severe Tropical Storm Maring brought heavy rainfall to Northern Luzon causing flooding and landslides.",
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
          description:
            "Typhoon Ulysses caused severe flooding in Metro Manila and surrounding provinces.",
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
          description:
            "Super Typhoon Rolly was one of the strongest typhoons to hit the Philippines in 2020, causing extensive damage.",
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
          description:
            "Typhoon Tisoy caused significant damage in Bicol Region and Southern Luzon.",
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
          description:
            "Typhoon Ursula struck the Philippines on Christmas Eve, causing damage in Eastern and Western Visayas.",
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
          description:
            "Super Typhoon Ompong was one of the strongest typhoons to hit the Philippines in 2018, causing extensive damage in Northern Luzon.",
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
          description:
            "Typhoon Rosita caused significant damage in Northern Luzon, particularly in Isabela and Mountain Province.",
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
                  className={`year-tab ${
                    selectedYear === year ? "active" : ""
                  }`}
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
                  style={{ height: "500px", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {typhoons.map((typhoon) => (
                    <React.Fragment key={typhoon.id}>
                      <Polyline
                        positions={typhoon.path}
                        color={
                          typhoon.color || getCategoryColor(typhoon.category)
                        }
                        weight={5}
                        opacity={0.7}
                        dashArray="6"
                      />
                      {typhoon.path.map((pos, idx) => (
                        <Marker
                          key={idx}
                          position={pos}
                          icon={createTyphoonIcon(
                            typhoon.color || getCategoryColor(typhoon.category)
                          )}
                          eventHandlers={{
                            click: () => handleTyphoonSelect(typhoon),
                          }}
                        >
                          <Popup>
                            <div>
                              <h3>{typhoon.name}</h3>
                              <p>
                                <strong>Date:</strong> {typhoon.date}
                              </p>
                              <p>
                                <strong>Category:</strong>{" "}
                                <span
                                  className={getCategoryClass(typhoon.category)}
                                >
                                  {typhoon.category}
                                </span>
                              </p>
                              <p>
                                <strong>Affected Areas:</strong>{" "}
                                {typhoon.affectedAreas.join(", ")}
                              </p>
                              <p>
                                <strong>Max Winds:</strong> {typhoon.maxWinds}
                              </p>
                              <p>{typhoon.description}</p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </React.Fragment>
                  ))}
                </MapContainer>
              </div>
            )}
          </div>

          <div className="typhoon-list-section">
            <h2>Typhoons in {selectedYear}</h2>
            {loading ? (
              <div className="loading">Loading typhoon data...</div>
            ) : (
              <ul className="typhoon-list">
                {typhoons.map((typhoon) => (
                  <li
                    key={typhoon.id}
                    className={`typhoon-list-item ${
                      selectedTyphoon && selectedTyphoon.id === typhoon.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleTyphoonSelect(typhoon)}
                  >
                    <span
                      className={`typhoon-dot ${getCategoryClass(
                        typhoon.category
                      )}`}
                      style={{
                        backgroundColor:
                          typhoon.color || getCategoryColor(typhoon.category),
                      }}
                    ></span>
                    <span className="typhoon-name">{typhoon.name}</span>
                    <span className="typhoon-date">{typhoon.date}</span>
                    <span
                      className={`typhoon-category ${getCategoryClass(
                        typhoon.category
                      )}`}
                    >
                      {typhoon.category}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedTyphoon && (
            <div className="typhoon-details-section">
              <h2>Typhoon Details: {selectedTyphoon.name}</h2>
              <div className="typhoon-details-card">
                <p>
                  <strong>Date:</strong> {selectedTyphoon.date}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  <span className={getCategoryClass(selectedTyphoon.category)}>
                    {selectedTyphoon.category}
                  </span>
                </p>
                <p>
                  <strong>Affected Areas:</strong>{" "}
                  {selectedTyphoon.affectedAreas.join(", ")}
                </p>
                <p>
                  <strong>Max Winds:</strong> {selectedTyphoon.maxWinds}
                </p>
                <p>
                  <strong>Description:</strong> {selectedTyphoon.description}
                </p>
              </div>

              <div className="weather-section">
                <h3>Current Weather in {selectedTyphoon.affectedAreas[0]}</h3>
                {weatherLoading ? (
                  <div className="loading">Loading weather data...</div>
                ) : currentWeather ? (
                  <div className="weather-info">
                    <div className="weather-main">
                      <img
                        src={getWeatherIconUrl(currentWeather.weather[0].icon)}
                        alt={currentWeather.weather[0].description}
                        className="weather-icon"
                      />
                      <span className="weather-desc">
                        {currentWeather.weather[0].description}
                      </span>
                    </div>
                    <div className="weather-details">
                      <div>
                        <Thermometer size={18} />{" "}
                        <span>
                          Temp: {currentWeather.main.temp}°C (Feels like:{" "}
                          {currentWeather.main.feels_like}°C)
                        </span>
                      </div>
                      <div>
                        <Droplet size={18} />{" "}
                        <span>Humidity: {currentWeather.main.humidity}%</span>
                      </div>
                      <div>
                        <Wind size={18} />{" "}
                        <span>Wind: {currentWeather.wind.speed} m/s</span>
                      </div>
                      <div>
                        <Cloud size={18} />{" "}
                        <span>Clouds: {currentWeather.clouds.all}%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-weather-data">
                    Weather data not available.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
  
}

export default PhilippineTyphoonTracker;
