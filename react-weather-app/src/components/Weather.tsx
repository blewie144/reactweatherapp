import './Weather.css';
import axios from 'axios';
import { useState } from 'react';

function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading

  const API_KEY = "4af1c3ec6913560bc8ff3a0e90f2c87b";

  const fetchWeather = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
      setError("");
    } catch (err) {
      setError("City not found or another error occurred.");
      setWeatherData(null);
    } finally {
      setLoading(false); // Set loading to false when fetching completes
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission reload
      fetchWeather();
    }
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyPress} // Listen for Enter key press
        />
        <button type="button" onClick={fetchWeather}>
          Get Weather
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {loading && (
        <div className="loading">
          <img
            src="https://i.gifer.com/ZZ5H.gif"
            alt="Loading..."
            style={{ width: "50px" }}
          />
        </div>
      )}

      {!loading && weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
            style={{ width: "100px", height: "100px" }}
          />
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default Weather;
