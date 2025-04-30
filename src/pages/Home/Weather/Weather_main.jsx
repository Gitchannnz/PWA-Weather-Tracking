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
} from "lucide-react";


const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("C");
  const [activeTab, setActiveTab] = useState("Temperature");

  // Location for Manolo Fortich, Philippines
  const location = {
    city: "Manolo Fortich",
    country: "PH",
    lat: 8.3675,
    lon: 124.8644,
  };

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    const fetchWeatherData = async () => {
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
  }, [API_KEY, location.lat, location.lon]);

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

  if (loading) {
    return (
      <div className="weather-app-fullscreen">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading weather data for Manolo Fortich...</p>
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
      <div className="weather-container">
        {/* Header Section */}
        <header className="app-header">
          <div className="location-info">
            <h1>
              {location.city}, {location.country}
            </h1>
            <p className="date-time">{getCurrentDateTime()}</p>
            <p className="weather-description">{weatherDescription}</p>
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
                  <span className="detail-value">
                    {precipitation.toFixed(0)}%
                  </span>
                </div>
                <div className="detail-item">
                  <Wind size={20} />
                  <span className="detail-label">Wind</span>
                  <span className="detail-value">
                    {windSpeed.toFixed(1)} km/h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hourly Forecast Graph */}
        <section className="hourly-forecast-section">
          <div className="section-header">
            <h2>Today's Forecast</h2>
            <div className="tab-buttons">
              <button
                className={activeTab === "Temperature" ? "active" : ""}
                onClick={() => setActiveTab("Temperature")}
              >
                <Thermometer size={16} />
                Temperature
              </button>
              <button
                className={activeTab === "Precipitation" ? "active" : ""}
                onClick={() => setActiveTab("Precipitation")}
              >
                <CloudRain size={16} />
                Precipitation
              </button>
              <button
                className={activeTab === "Wind" ? "active" : ""}
                onClick={() => setActiveTab("Wind")}
              >
                <Wind size={16} />
                Wind
              </button>
            </div>
          </div>

          <div className="hourly-chart">
            {hourlyData.map((item, index) => (
              <div key={index} className="hourly-column">
                <span className="hour-temp">{convertTemp(item.temp)}°</span>
                <div className="hour-bar-container">
                  <div
                    className="hour-bar"
                    style={{
                      height: `${Math.max(30, (item.temp / 40) * 100)}%`,
                      backgroundColor: `hsl(${200 - item.temp * 5}, 80%, 60%)`,
                    }}
                  ></div>
                </div>
                <div className="hour-icon">
                  {getWeatherIcon(item.weather, 16)}
                </div>
                <span className="hour-label">{item.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Weekly Forecast */}
        <section className="weekly-forecast-section">
          <h2>7-Day Forecast</h2>
          <div className="forecast-container">
            {forecastData.map((day, index) => (
              <div key={index} className="forecast-day">
                <div className="day-header">
                  <span className="day-name">{day.day}</span>
                  <span className="day-date">
                    {day.month} {day.date}
                  </span>
                </div>
                <div className="day-icon">
                  {getWeatherIcon(day.weather.icon, 24)}
                </div>
                <div className="day-temps">
                  <span className="day-high">{convertTemp(day.tempMax)}°</span>
                  <span className="day-low">{convertTemp(day.tempMin)}°</span>
                </div>
                <div className="day-details">
                  <div className="day-detail">
                    <CloudRain size={14} />
                    <span>{day.precipitation.toFixed(0)}%</span>
                  </div>
                  <div className="day-detail">
                    <Droplets size={14} />
                    <span>{day.humidity}%</span>
                  </div>
                  <div className="day-detail">
                    <Wind size={14} />
                    <span>{day.windSpeed.toFixed(1)} km/h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default WeatherApp;
