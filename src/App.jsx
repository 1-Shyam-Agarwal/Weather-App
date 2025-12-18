import { useEffect, useState } from "react";
import WeatherInfo from "./components/WeatherInfo.jsx";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function App() {
  const [currentTab, setCurrentTab] = useState("user");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [showGrant, setShowGrant] = useState(false);
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentTab === "user") {
      const saved = sessionStorage.getItem("user-coordinates");
      if (!saved) {
        setShowGrant(true);
      } else {
        fetchByCoords(JSON.parse(saved));
      }
    }
  }, [currentTab]);

  async function fetchByCoords({ lat, lon }) {
    try {
      setLoading(true);
      setError(null);
      setShowGrant(false);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("Unable to fetch weather");
      const data = await res.json();
      setWeather(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchByCity(e) {
    e.preventDefault();
    if (!city.trim()) return; // prevent empty search
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        sessionStorage.setItem("user-coordinates", JSON.stringify(coords));
        fetchByCoords(coords);
      },
      () => setError("Permission denied for location")
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-700 text-white p-4 sm:p-6 md:p-10">
      <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold">
        Weather App
      </h1>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-6">
        <button
          onClick={() => setCurrentTab("user")}
          className={`px-4 py-2 rounded ${
            currentTab === "user" ? "bg-white/30" : ""
          }`}
        >
          Your Weather
        </button>
        <button
          onClick={() => setCurrentTab("search")}
          className={`px-4 py-2 rounded ${
            currentTab === "search" ? "bg-white/30" : ""
          }`}
        >
          Search Weather
        </button>
      </div>

      {/* Search Form */}
      {currentTab === "search" && (
        <form
          onSubmit={fetchByCity}
          className="flex flex-col sm:flex-row justify-center mt-6 gap-2"
        >
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city"
            className="px-4 py-2 rounded text-white w-full sm:w-auto bg-white/10 placeholder:text-white focus:outline-none"
          />
          <button className="bg-blue-600 px-4 py-2 rounded w-full sm:w-auto mt-2 sm:mt-0">
            Search
          </button>
        </form>
      )}

      {/* Grant Location */}
      {showGrant && currentTab === "user" && (
        <div className="flex flex-col items-center mt-10 gap-4">
          <p className="text-lg sm:text-xl">Allow location access</p>
          <button
            onClick={handleLocation}
            className="bg-blue-600 px-6 py-2 rounded"
          >
            Grant Access
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && <p className="text-center mt-10">Loading...</p>}

      {/* Error */}
      {error && !loading && (
        <p className="text-red-400 text-center mt-4">{error}</p>
      )}

      {/* Weather Info */}
      {weather && !loading && !error && <WeatherInfo data={weather} />}
    </div>
  );
}
