import { useState, useEffect } from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  Loader,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("C");
  const [activeTab, setActiveTab] = useState("Temperature");
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // Register service worker on mount
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  // Get user's location
  useEffect(() => {
    const getUserLocation = () => {
      setLocationLoading(true);
      setLocationError(null);

      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by your browser");
        setLocationLoading(false);
        // Fallback to default location
        setLocation({
          city: "Loading city...",
          country: "",
          lat: 8.3675,
          lon: 124.8644,
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            // Reverse geocoding to get city name
            const geocodeRes = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
            );

            if (!geocodeRes.ok) {
              throw new Error("Failed to fetch location data");
            }

            const locationData = await geocodeRes.json();

            if (locationData && locationData.length > 0) {
              setLocation({
                city: locationData[0].name,
                country: locationData[0].country,
                lat: latitude,
                lon: longitude,
              });

              toast.success("Weather for your current location loaded!");
            } else {
              throw new Error("Location not found");
            }

            setLocationLoading(false);
          } catch (err) {
            console.error("Error getting location name:", err);
            setLocation({
              city: "Unknown Location",
              country: "",
              lat: latitude,
              lon: longitude,
            });
            setLocationLoading(false);
          }
        },
        (err) => {
          console.error("Error getting location:", err);
          setLocationError(
            "Unable to retrieve your location. Please allow location access."
          );
          setLocationLoading(false);

          // Fallback to default location
          setLocation({
            city: "Manolo Fortich",
            country: "PH",
            lat: 8.3675,
            lon: 124.8644,
          });

          toast.error("Location access denied. Using default location.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    getUserLocation();
  }, [API_KEY]);

  // Fetch weather data once we have location
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!location) return;

      setLoading(true);
      setError(null);

      try {
        // Current weather data
        const currentRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`
        );

        // Forecast data (5 day / 3 hour forecast)
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`
        );

        if (!currentRes.ok || !forecastRes.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const currentData = await currentRes.json();
        const forecast = await forecastRes.json();

        setWeatherData(currentData);

        // Process forecast data to get daily forecasts and hourly data
        const { dailyForecasts, todayHourly } = processForecastData(
          forecast.list
        );
        setForecastData(dailyForecasts);
        setHourlyData(todayHourly);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [API_KEY, location]);

  // Process the 3-hour forecast data to get daily forecasts and hourly data for today
  const processForecastData = (forecastList) => {
    const dailyData = [];
    const days = {};
    const todayHourly = [];
    const today = new Date().toLocaleDateString("en-US", { weekday: "short" });

    forecastList.forEach((item, index) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      const hour = date.getHours();
      const hourFormatted =
        hour === 0
          ? "12 AM"
          : hour === 12
          ? "12 PM"
          : hour > 12
          ? `${hour - 12} PM`
          : `${hour} AM`;

      // For today's hourly forecast (first 8 entries or first day)
      if (index < 8 || day === today) {
        if (todayHourly.length < 8) {
          todayHourly.push({
            time: index === 0 ? "Now" : hourFormatted,
            temp: item.main.temp,
            weather: item.weather[0].icon,
          });
        }
      }

      // For daily forecast
      if (!days[day]) {
        days[day] = {
          day,
          date: date.getDate(),
          month: date.toLocaleDateString("en-US", { month: "short" }),
          tempMax: item.main.temp_max,
          tempMin: item.main.temp_min,
          weather: item.weather[0],
          precipitation: item.pop * 100, // Probability of precipitation
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
        };
        dailyData.push(days[day]);
      } else {
        days[day].tempMax = Math.max(days[day].tempMax, item.main.temp_max);
        days[day].tempMin = Math.min(days[day].tempMin, item.main.temp_min);
        // Update with highest precipitation chance
        days[day].precipitation = Math.max(
          days[day].precipitation,
          item.pop * 100
        );
      }
    });

    // If we don't have enough hourly data, fill with estimates
    while (todayHourly.length < 8) {
      const lastEntry = todayHourly[todayHourly.length - 1];
      const lastTime = lastEntry.time;
      let nextTime;

      if (lastTime === "Now") {
        nextTime = "3 AM";
      } else {
        const timeParts = lastTime.split(" ");
        let hour = parseInt(timeParts[0]);
        const period = timeParts[1];

        hour = (hour + 3) % 12;
        if (hour === 0) hour = 12;
        nextTime = `${hour} ${
          period === "AM" && hour === 12
            ? "PM"
            : period === "PM" && hour === 12
            ? "AM"
            : period
        }`;
      }

      // Estimate the temperature with a typical day/night cycle
      let tempEstimate = lastEntry.temp;
      if (nextTime.includes("AM") && parseInt(nextTime) >= 6) {
        tempEstimate += 1; // Warming up in morning
      } else if (nextTime.includes("PM") && parseInt(nextTime) < 6) {
        tempEstimate += 0.5; // Peak afternoon
      } else {
        tempEstimate -= 0.5; // Cooling in evening/night
      }

      todayHourly.push({
        time: nextTime,
        temp: tempEstimate,
        weather: lastEntry.weather,
      });
    }

    return {
      dailyForecasts: dailyData.slice(0, 7), // Return the next 7 days
      todayHourly: todayHourly.slice(0, 8), // Return 8 hourly points
    };
  };

  // Function to search for a new location
  const searchLocation = async (cityName) => {
    if (!cityName) return;

    setLocationLoading(true);
    setLocationError(null);

    try {
      // Geocoding API to get coordinates from city name
      const geocodeRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          cityName
        )}&limit=1&appid=${API_KEY}`
      );

      if (!geocodeRes.ok) {
        throw new Error("Failed to fetch location data");
      }

      const locationData = await geocodeRes.json();

      if (locationData && locationData.length > 0) {
        setLocation({
          city: locationData[0].name,
          country: locationData[0].country,
          lat: locationData[0].lat,
          lon: locationData[0].lon,
        });

        toast.success(`Weather for ${locationData[0].name} loaded!`);
      } else {
        throw new Error("Location not found");
      }

      setLocationLoading(false);
    } catch (err) {
      console.error("Error searching location:", err);
      setLocationError("Location not found. Please try again.");
      setLocationLoading(false);
      toast.error("Location not found. Please try again.");
    }
  };

  // Convert temperature between C and F
  const convertTemp = (temp) => {
    if (unit === "F") {
      return ((temp * 9) / 5 + 32).toFixed(0);
    }
    return temp.toFixed(0);
  };

  // Get weather icon based on weather condition code
  const getWeatherIcon = (iconCode, size = 24) => {
    if (!iconCode) return <Cloud size={size} />;

    if (iconCode.includes("01")) {
      return <Sun size={size} className="weather-icon-sun" />;
    } else if (
      iconCode.includes("02") ||
      iconCode.includes("03") ||
      iconCode.includes("04")
    ) {
      return <Cloud size={size} className="weather-icon-cloud" />;
    } else if (iconCode.includes("09") || iconCode.includes("10")) {
      return <CloudRain size={size} className="weather-icon-rain" />;
    } else if (iconCode.includes("11")) {
      return <CloudLightning size={size} className="weather-icon-storm" />;
    } else if (iconCode.includes("13")) {
      return <CloudSnow size={size} className="weather-icon-snow" />;
    } else {
      return <Cloud size={size} className="weather-icon-cloud" />;
    }
  };

  // Get current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Push Notification function
const sendWeatherNotification = () => {
  if (!weatherData || !location) {
    toast.error("Weather data not loaded yet.");
    return;
  }

  const mainWeather = weatherData.weather[0].main.toLowerCase();
  const description = weatherData.weather[0].description;
  const temp = convertTemp(weatherData.main.temp);
  const city = location.city;

  let title = "Today's Weather";
  let message = `Weather in ${city}: ${description}, ${temp}°${unit}.`;

  if (
    mainWeather.includes("typhoon") ||
    mainWeather.includes("storm") ||
    mainWeather.includes("thunderstorm")
  ) {
    title = "⚠️ Typhoon/Storm Alert!";
    message = `Severe weather in ${city}: ${description}. Stay safe!`;
  } else if (mainWeather.includes("rain")) {
    title = "🌧️ Rain Alert";
    message = `Rain expected in ${city}: ${description}. Don't forget your umbrella!`;
  } else if (mainWeather.includes("snow")) {
    title = "❄️ Snow Alert";
    message = `Snow in ${city}: ${description}. Dress warmly!`;
  }

  // Request permission if needed
  if (window.Notification && Notification.permission !== "granted") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            body: message,
            icon: `/weather-icons/${weatherData.weather[0].icon}.png`,
            badge: "/favicon.ico",
            vibrate: [200, 100, 200],
          });
        });
        toast.success("Weather notification sent!");
      } else {
        toast.info("Notification permission denied.");
      }
    });
  } else if (window.Notification && Notification.permission === "granted") {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        body: message,
        icon: `/weather-icons/${weatherData.weather[0].icon}.png`,
        badge: "/favicon.ico",
        vibrate: [200, 100, 200],
      });
    });
    toast.success("Weather notification sent!");
  } else {
    toast.info(message);
  }
};


  if (locationLoading) {
    return (
      <div className="weather-app-fullscreen">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Detecting your location...</p>
        </div>
      </div>
    );
  }

  if (locationError && !location) {
    return (
      <div className="weather-app-fullscreen">
        <div className="error-container">
          <h2>Location Error</h2>
          <p>{locationError}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="weather-app-fullscreen">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading weather data for {location?.city || "your location"}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-app-fullscreen">
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  const currentTemp = weatherData?.main.temp;
  const highTemp = weatherData?.main.temp_max;
  const lowTemp = weatherData?.main.temp_min;
  const humidity = weatherData?.main.humidity;
  const precipitation = weatherData?.rain?.["1h"]
    ? weatherData.rain["1h"] * 100
    : 0;
  const windSpeed = weatherData?.wind.speed;
  const weatherDescription = weatherData?.weather[0].description;
  const weatherIcon = weatherData?.weather[0].icon;

  return (
    <div className="weather-app-fullscreen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="weather-container">
        {/* Header Section */}
        <header className="app-header">
          <div className="location-info">
            <div className="location-header">
              <MapPin size={18} />
              <h1>
                {location.city}
                {location.country ? `, ${location.country}` : ""}
              </h1>
            </div>
            <p className="date-time">{getCurrentDateTime()}</p>
            <p className="weather-description">{weatherDescription}</p>
          </div>

          {/* Location Search */}
          <div className="location-search">
            <input
              type="text"
              placeholder="Search city..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchLocation(e.target.value);
                  e.target.value = "";
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector(".location-search input");
                searchLocation(input.value);
                input.value = "";
              }}
            >
              Search
            </button>
          </div>

          <div className="units-toggle">
            <button
              className={unit === "C" ? "active" : ""}
              onClick={() => setUnit("C")}
            >
              C
            </button>
            <button
              className={unit === "F" ? "active" : ""}
              onClick={() => setUnit("F")}
            >
              F
            </button>
            <button
              onClick={sendWeatherNotification}
              className="notification-btn"
              style={{
                marginLeft: 10,
                padding: "8px 12px",
                backgroundColor: "#4a6fa1",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#3a5a8a")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#4a6fa1")
              }
            >
              Try Weather Alert
            </button>
          </div>
        </header>

        {/* Current Weather Summary */}
        <section className="current-weather-section">
          <div className="greeting-container">
            <h2>{getGreeting()}</h2>
            <p>Here's your weather update for today</p>
          </div>

          <div className="current-weather-card">
            <div className="weather-now">
              <div className="temp-container">
                <div className="icon-large">
                  {getWeatherIcon(weatherIcon, 64)}
                </div>
                <div className="temp-display">
                  <span className="current-temp">
                    {convertTemp(currentTemp)}°
                  </span>
                  <div className="high-low">
                    <span>H: {convertTemp(highTemp)}°</span>
                    <span>L: {convertTemp(lowTemp)}°</span>
                  </div>
                </div>
              </div>

              <div className="current-details">
                <div className="detail-item">
                  <Droplets size={20} />
                  <span className="detail-label">Humidity</span>
                  <span className="detail-value">{humidity}%</span>
                </div>
                <div className="detail-item">
                  <CloudRain size={20} />
                  <span className="detail-label">Precipitation</span>
                  <span className="detail-value">{precipitation}%</span>
                </div>
                <div className="detail-item">
                  <Wind size={20} />
                  <span className="detail-label">Wind Speed</span>
                  <span className="detail-value">{windSpeed} m/s</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Forecast Section */}
        <section className="forecast-section">
          <h3>7-Day Forecast</h3>
          <div className="daily-forecast-list">
            {forecastData.map((day) => (
              <div key={day.day + day.date} className="daily-forecast-card">
                <div className="day-header">
                  <span>{day.day}</span>,{" "}
                  <span>
                    {day.month} {day.date}
                  </span>
                </div>
                <div className="weather-icon">
                  {getWeatherIcon(day.weather.icon)}
                </div>
                <div className="temps">
                  <span>H: {convertTemp(day.tempMax)}°</span>
                  <span>L: {convertTemp(day.tempMin)}°</span>
                </div>
                <div className="precipitation">
                  Precip: {Math.round(day.precipitation)}%
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hourly Forecast Section */}
        <section className="hourly-forecast-section">
          <h3>Today's Hourly Forecast</h3>
          <div className="hourly-forecast-list">
            {hourlyData.map((hour, idx) => (
              <div key={idx} className="hourly-forecast-card">
                <span className="hourly-time">{hour.time}</span>
                <div className="weather-icon">
                  {getWeatherIcon(hour.weather)}
                </div>
                <span className="hourly-temp">{convertTemp(hour.temp)}°</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default WeatherApp;
