import './Weather.css';
import axios from 'axios';
import { useState } from 'react';

// Define a type for the weather data
type WeatherData = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
};

function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [unit, setUnit] = useState("celsius");
  const [unitSymbol, setUnitSymbol] = useState("°C");

  const API_KEY = "4af1c3ec6913560bc8ff3a0e90f2c87b";

  const convertUnit = () => {
    // Check if the unit is celsius, if it is, set it to fahrenheit and vice versa
    if (unit === "celsius") {
      setUnit("fahrenheit");
      setUnitSymbol("°F");
    } else {
      setUnit("celsius");
      setUnitSymbol("°C");
    }
  };

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      setWeatherData(response.data);
      setError("");
    } catch (err) {
      setError("City not found or another error occurred.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission reload
      fetchWeather();
    }
  };

  // Add this helper function for temperature conversion
  const convertTemperature = (kelvin: number): number => {
    if (unit === "celsius") {
      return Math.round(kelvin - 273.15); // Kelvin to Celsius
    } else {
      return Math.round((kelvin - 273.15) * 9/5 + 32); // Kelvin to Fahrenheit
    }
  };

  // Helper function to convert wind speed to km/h 
  const convertWindSpeed = (speed: number): number => {
    return Math.round(speed * 3.6);
  };

  return (
    <div className="weather">
      <h1 style={{ marginBottom: "20px" }}>React Weather API App</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search City..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button type="button" onClick={() => fetchWeather()}>
          Get Weather
        </button>
        <div className="unit-toggle">
          <span>°C</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={unit === "fahrenheit"}
              onChange={convertUnit}
            />
            <span className="slider round"></span>
          </label>
          <span>°F</span>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {loading && (
        <div className="loading">
          <img
            src="https://i.gifer.com/ZZ5H.gif"
            alt="Loading..."
            style={{ width: "100px" }}
          />
        </div>
      )}

      {!loading && weatherData && (
        <div>
          <h2>{(weatherData as WeatherData).name}</h2>
          <p>Temperature: {convertTemperature((weatherData as WeatherData).main.temp)}{unitSymbol}</p>
          <p>Weather: {(weatherData as WeatherData).weather[0].description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${(weatherData as WeatherData).weather[0].icon}@2x.png`}
            alt={(weatherData as WeatherData).weather[0].description}
            style={{ width: "100px", height: "100px" }}
          />
          <p>Humidity: {(weatherData as WeatherData).main.humidity}%</p>
          <p>
            Wind Speed: {convertWindSpeed((weatherData as WeatherData).wind.speed)} km/h
          </p>
        </div>
      )}
    </div>
  );
}

export default Weather;
