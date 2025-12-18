export default function WeatherInfo({ data }) {
  return (
    <div className="mt-10 flex flex-col items-center gap-4">
      {/* City + Flag */}
      <div className="flex items-center gap-2 text-2xl font-semibold">
        {data.name}, {data.sys.country}
        <img
          src={`https://flagcdn.com/144x108/${data.sys.country.toLowerCase()}.png`}
          className="w-6 h-4 object-cover rounded-sm"
        />
      </div>

      {/* Weather Icon */}
      <img
        src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
        className="w-28 h-28"
      />

      {/* Description */}
      <p className="capitalize text-lg">{data.weather[0].description}</p>

      {/* Temperature */}
      <p className="text-5xl font-bold">{data.main.temp.toFixed(1)}°C</p>

      {/* Mini Info Cards */}
      <div className="flex gap-4 mt-6 flex-wrap justify-center">
        <div className="bg-white/20 px-6 py-4 rounded-lg text-center min-w-[100px]">
          💨 <br /> {data.wind.speed} m/s
        </div>
        <div className="bg-white/20 px-6 py-4 rounded-lg text-center min-w-[100px]">
          💧 <br /> {data.main.humidity}%
        </div>
        <div className="bg-white/20 px-6 py-4 rounded-lg text-center min-w-[100px]">
          ☁️ <br /> {data.clouds.all}%
        </div>
      </div>
    </div>
  );
}
