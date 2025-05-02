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
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/firebaseutil_main";

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
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [selectedTyphoon, setSelectedTyphoon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({ category: "" });

  const weatherApiKey = "b47fba205d86b1e6f7dddfd426314b54";
  const mapCenter = [12.8797, 121.774];
  const mapZoom = 6;

  // Generate available years for selection
  useEffect(() => {
    const generateYears = () => {
      const currentYear = new Date().getFullYear();
      const startYear = 2010; // Matching admin panel start year
      return Array.from({ length: currentYear - startYear + 1 }, (_, i) =>
        (currentYear - i).toString()
      );
    };

    setYears(generateYears());
  }, []);

  // Fetch initial count of typhoons
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const countQuery = query(collection(FIREBASE_DB, "typhoons"));
        const snapshot = await getDocs(countQuery);
        setTotalCount(snapshot.size);
      } catch (error) {
        console.error("Error fetching typhoon count:", error);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch typhoon data from Firebase
  useEffect(() => {
    const fetchTyphoonData = async () => {
      setLoading(true);
      try {
        const typhoonData = await fetchTyphoonDataFromFirebase(
          selectedYear,
          filters.category
        );

        if (typhoonData.length === 0) {
          setError("No typhoon data found for this year.");
        } else {
          setTyphoons(typhoonData);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching typhoon data:", err);
        setError("Failed to fetch typhoon data from database.");
      } finally {
        setLoading(false);
      }
    };

    fetchTyphoonData();
  }, [selectedYear, filters.category]);

  // Function to build the query
  const buildQuery = (year, category) => {
    const typhoonsRef = collection(FIREBASE_DB, "typhoons");
    let baseQuery = [];

    if (year && year !== "") {
      baseQuery.push(where("year", "==", parseInt(year)));
    }

    baseQuery.push(orderBy("createdAt", "desc"));
    baseQuery.push(limit(20)); // Limiting to 20 for better map performance

    return query(typhoonsRef, ...baseQuery);
  };

  // Function to fetch typhoon data from Firebase
  const fetchTyphoonDataFromFirebase = async (year, category) => {
    try {
      const q = buildQuery(year, category);
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log(`No typhoons found for year ${year}`);
        return [];
      }

      const typhoonData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.createdAt?.toDate();

        // Process the landfall data
        let landfallCoordinates = [];
        if (data.landfall && data.landfall.geoLocation) {
          const lat = data.landfall.geoLocation.lat;
          const lng = data.landfall.geoLocation.lng;

          if (lat && lng) {
            landfallCoordinates = [[lat, lng]];
          }
        }

        // Create path from landfall coordinates or use placeholder
        const path =
          landfallCoordinates.length > 0
            ? landfallCoordinates
            : [
                [12.5, 126.0], // Placeholder path if no landfall data
                [13.0, 125.0],
              ];

        const typhoon = {
          id: doc.id,
          name: data.name || "Unknown Typhoon",
          localName: data.localName || "",
          date: date ? date.toLocaleDateString() : "Unknown Date",
          formattedDate: date ? date.toLocaleDateString() : "N/A",
          year: data.year || new Date().getFullYear(),
          category: data.category || "Tropical Storm",
          path: path,
          landfall: data.landfall || {},
          rainfall: data.rainfall || 0,
          windSpeed: data.windSpeed || 0,
          color: getCategoryColor(data.category || "Tropical Storm"),
          description:
            data.description || `Typhoon that affected the Philippines`,
          affectedAreas: data.affectedAreas || ["Philippines"],
        };

        // Only add typhoons matching the category filter if one is set
        if (!category || category === "" || typhoon.category === category) {
          typhoonData.push(typhoon);
        }
      });

      console.log(`Found ${typhoonData.length} typhoons for year ${year}`);
      return typhoonData;
    } catch (error) {
      console.error("Error fetching from Firebase:", error);
      throw error;
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

  // Function to fetch weather data for selected typhoon's landfall location
  const fetchWeatherData = async () => {
    if (
      !selectedTyphoon ||
      !selectedTyphoon.landfall ||
      !selectedTyphoon.landfall.location
    ) {
      return;
    }

    setWeatherLoading(true);
    try {
      // Using the landfall location for weather data
      const area = selectedTyphoon.landfall.location || "Philippines";
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
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setCurrentWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedTyphoon(null);
  };

  const handleCategoryChange = (e) => {
    setFilters({ ...filters, category: e.target.value });
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
    switch (category) {
      case "Super Typhoon":
        return "#ef4444"; // Red
      case "Typhoon":
        return "#f97316"; // Orange
      case "Severe Tropical Storm":
        return "#f59e0b"; // Amber
      case "Tropical Storm":
        return "#10b981"; // Green
      case "Tropical Depression":
        return "#3b82f6"; // Blue
      default:
        return "#8b5cf6"; // Purple (Low Pressure Area or others)
    }
  };

  // Helper function for category class
  const getCategoryClass = (category) => {
    switch (category) {
      case "Super Typhoon":
        return "category-super";
      case "Typhoon":
        return "category-typhoon";
      case "Severe Tropical Storm":
        return "category-severe";
      case "Tropical Storm":
        return "category-tropical";
      case "Tropical Depression":
        return "category-depression";
      default:
        return "category-other";
    }
  };

  // Weather icon URL builder
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Function to safely render typhoon path on map
  const renderTyphoonPath = (typhoon) => {
    if (!typhoon.path || typhoon.path.length < 1) {
      console.warn(`Typhoon ${typhoon.name} has invalid path data`);
      return null;
    }

    // For single point typhoons, create a small circle path around the point
    let pathPositions = typhoon.path;
    if (typhoon.path.length === 1) {
      const [lat, lng] = typhoon.path[0];
      pathPositions = [
        [lat, lng],
        [lat + 0.1, lng + 0.1],
        [lat - 0.1, lng + 0.1],
        [lat, lng],
      ];
    }

    return (
      <React.Fragment key={typhoon.id}>
        <Polyline
          positions={pathPositions}
          color={typhoon.color}
          weight={5}
          opacity={0.7}
          dashArray="6"
        />
        {typhoon.path.map((pos, idx) => (
          <Marker
            key={idx}
            position={pos}
            icon={createTyphoonIcon(typhoon.color)}
            eventHandlers={{
              click: () => handleTyphoonSelect(typhoon),
            }}
          >
            <Popup>
              <div>
                <h3>
                  {typhoon.name} {typhoon.localName && `(${typhoon.localName})`}
                </h3>
                <p>
                  <strong>Date:</strong> {typhoon.formattedDate}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  <span className={getCategoryClass(typhoon.category)}>
                    {typhoon.category}
                  </span>
                </p>
                <p>
                  <strong>Wind Speed:</strong> {typhoon.windSpeed} kph
                </p>
                <p>
                  <strong>Rainfall:</strong> {typhoon.rainfall} mm
                </p>
                {typhoon.landfall && typhoon.landfall.location && (
                  <p>
                    <strong>Landfall:</strong> {typhoon.landfall.location}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </React.Fragment>
    );
  };

  return (
    <>
      <div className="typhoon-tracker-container">
        <NavBar />
        <header className="tracker-header">
          <h1>Philippine Typhoon Tracking</h1>
          <div className="tracker-stats">
            <span className="total-count">Total Records: {totalCount}</span>
          </div>
        </header>

        <main className="tracker-content">
          <div className="filter-container">
            <div className="year-selector">
              <label htmlFor="year-select">Year: </label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={handleYearChange}
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="category-selector">
              <label htmlFor="category-select">Category: </label>
              <select
                id="category-select"
                value={filters.category}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                <option value="Super Typhoon">Super Typhoon</option>
                <option value="Typhoon">Typhoon</option>
                <option value="Severe Tropical Storm">
                  Severe Tropical Storm
                </option>
                <option value="Tropical Storm">Tropical Storm</option>
                <option value="Tropical Depression">Tropical Depression</option>
                <option value="Low Pressure Area">Low Pressure Area</option>
              </select>
            </div>
          </div>

          <div className="map-container">
            <h2>
              Typhoon Tracks {selectedYear !== "" ? `for ${selectedYear}` : ""}
            </h2>

            <div className="year-tabs">
              <button
                className={`year-tab ${selectedYear === "" ? "active" : ""}`}
                onClick={() => handleYearTabClick("")}
              >
                All
              </button>
              {years.slice(0, 5).map((year) => (
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

            {error && (
              <div
                className="error-message"
                style={{
                  color: "#f97316",
                  margin: "10px 0",
                  padding: "10px",
                  backgroundColor: "#ffe4d6",
                  borderRadius: "5px",
                }}
              >
                {error}
              </div>
            )}

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

                  {typhoons.map(
                    (typhoon) =>
                      typhoon.path &&
                      typhoon.path.length >= 1 &&
                      renderTyphoonPath(typhoon)
                  )}
                </MapContainer>
              </div>
            )}
          </div>

          <div className="typhoon-list-section">
            <h2>Typhoons {selectedYear !== "" ? `in ${selectedYear}` : ""}</h2>
            {loading ? (
              <div className="loading">Loading typhoon data...</div>
            ) : typhoons.length > 0 ? (
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
                        backgroundColor: typhoon.color,
                      }}
                    ></span>
                    <span className="typhoon-name">
                      {typhoon.name}
                      {typhoon.localName && (
                        <span className="typhoon-local-name">
                          {" "}
                          ({typhoon.localName})
                        </span>
                      )}
                    </span>
                    <span className="typhoon-date">
                      {typhoon.formattedDate}
                    </span>
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
            ) : (
              <div className="no-data">
                No typhoon data available for the selected filters
              </div>
            )}
          </div>

          {selectedTyphoon && (
            <div className="typhoon-details-section">
              <h2>Typhoon Details: {selectedTyphoon.name}</h2>
              <div className="typhoon-details-card">
                <div className="typhoon-header">
                  <h3>
                    {selectedTyphoon.name}{" "}
                    {selectedTyphoon.localName && (
                      <span>({selectedTyphoon.localName})</span>
                    )}
                  </h3>
                  <span
                    className={`typhoon-category-badge ${getCategoryClass(
                      selectedTyphoon.category
                    )}`}
                  >
                    {selectedTyphoon.category}
                  </span>
                </div>

                <div className="typhoon-stats">
                  <div className="stat-item">
                    <Wind size={20} />
                    <div>
                      <span className="stat-label">Wind Speed</span>
                      <span className="stat-value">
                        {selectedTyphoon.windSpeed} kph
                      </span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <Droplet size={20} />
                    <div>
                      <span className="stat-label">Rainfall</span>
                      <span className="stat-value">
                        {selectedTyphoon.rainfall} mm
                      </span>
                    </div>
                  </div>
                </div>

                <div className="typhoon-info">
                  <p>
                    <strong>Date:</strong> {selectedTyphoon.formattedDate}
                  </p>

                  {selectedTyphoon.landfall &&
                    selectedTyphoon.landfall.location && (
                      <p>
                        <strong>Landfall:</strong>{" "}
                        {selectedTyphoon.landfall.location}
                      </p>
                    )}

                  {selectedTyphoon.description && (
                    <p>
                      <strong>Description:</strong>{" "}
                      {selectedTyphoon.description}
                    </p>
                  )}
                </div>
              </div>

              {selectedTyphoon.landfall &&
                selectedTyphoon.landfall.location && (
                  <div className="weather-section">
                    <h3>Current Weather at Landfall Location</h3>
                    {weatherLoading ? (
                      <div className="loading">Loading weather data...</div>
                    ) : currentWeather ? (
                      <div className="weather-info">
                        <div className="weather-main">
                          <img
                            src={getWeatherIconUrl(
                              currentWeather.weather[0].icon
                            )}
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
                            <span>
                              Humidity: {currentWeather.main.humidity}%
                            </span>
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
                )}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

export default PhilippineTyphoonTracker;
