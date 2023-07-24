document.addEventListener('DOMContentLoaded', function () {
    const searchIcon = document.getElementById('searchIcon');
    const searchBox = document.getElementById('searchBox');

    searchIcon.onclick = function () {
        searchBox.classList.toggle("active");
        searchIcon.classList.toggle("active");
    };
});

function getWeatherData(apiUrl, cityName = "Riga") {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const currentCityElement = document.getElementById("current-city");
        const currentTempElement = document.getElementById("current-temp");
        const currentConditionsElement = document.getElementById(
          "current-conditions"
        );
        const minMaxTempElement = document.getElementById("min-max-temp");

        // Get the latest weather data from the API response
        const latestWeatherData = data.hourly.temperature_2m.slice(-1)[0];
        const latestWeatherConditions = data.daily.weathercode.slice(-1)[0];
        const minTemperature = data.daily.temperature_2m_min[0];
        const maxTemperature = data.daily.temperature_2m_max[0];

        // Update the HTML elements with the received data
        currentCityElement.textContent = cityName;
        currentTempElement.textContent = `${latestWeatherData}°C`;
        currentConditionsElement.textContent = getWeatherDescription(
          latestWeatherConditions
        );
        minMaxTempElement.textContent = `Max: ${maxTemperature}°C, Min: ${minTemperature}°C`;
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  }

  function searchWeather() {
    const cityInput = document.getElementById('cityInput').value;
    if (!cityInput) {
      alert('Please enter a city name');
      return;
    }

    const geocodingApiUrl = `https://geocode.xyz/${encodeURIComponent(cityInput)}?json=1`;

    fetch(geocodingApiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.error || !data.latt || !data.longt) {
          alert('City not found. Please enter a valid city name.');
          return;
        }

        const latitude = data.latt;
        const longitude = data.longt;

        // Now you have the latitude and longitude of the searched city
        // Use it to construct the weather API URL
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;

        // Clear the input after a successful search
        document.getElementById('cityInput').value = '';

        // Fetch weather data for the searched city
        getWeatherData(apiUrl, cityInput);

        const weatherBox = document.getElementById('weatherBox');
        weatherBox.classList.add('active');
      })
      .catch((error) => {
        console.error('Error fetching geocoding data:', error);
      });
  }

  function fetchWeatherData(apiUrl) {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Get the latest weather data from the API response
        const latestWeatherData = data.hourly.temperature_2m.slice(-1)[0];
        const latestWeatherConditions = data.daily.weathercode.slice(-1)[0];

        // Update the HTML elements with the received data
        const currentTempElement = document.getElementById('current-temp');
        const currentConditionsElement = document.getElementById('current-conditions');

        currentTempElement.textContent = `${latestWeatherData}°C`;
        currentConditionsElement.textContent = getWeatherDescription(latestWeatherConditions);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  }

  // Helper function to convert weather code to a human-readable description
  function getWeatherDescription(weatherCode) {
    // You can create a mapping of weather codes to descriptions here
    // For simplicity, I'm providing a sample mapping for some weather codes
    const weatherDescriptions = {
        0: "Clear sky",
        1: "Mainly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Fog",
        51: "Drizzle: Light",
        53: "Drizzle: Moderate",
        55: "Drizzle: Dense",
        56: "Freezing Drizzle: Light",
        57: "Freezing Drizzle: Dense",
        61: "Rain: Slight",
        63: "Rain: Moderate",
        65: "Rain: Heavy",
        66: "Freezing Rain: Light",
        67: "Freezing Rain: Heavy",
        71: "Snow: Slight",
        73: "Snow: Moderate",
        75: "Snow: Heavy",
        77: "Snow Grains",
        80: "Rain Showers: Slight",
        81: "Rain Showers: Moderate/Heavy",
        82: "Rain Showers: Violent",
        85: "Snow Showers: Slight",
        86: "Snow Showers: Heavy",
        95: "Thunderstorms: Slight/Moderate",
        96: "Thunderstorms: Slight Hail",
        99: "Thunderstorms: Heavy Hail"
      // Add more descriptions as needed
    };

    return weatherDescriptions[weatherCode] || "Unknown";
  }

  // Call the function to fetch and display the weather data
getWeatherData();

  // Call the function to fetch and display the weather data for the default city (Riga)
  const defaultApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=56.946&longitude=24.1059&hourly=temperature_2m,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
  fetchWeatherData(defaultApiUrl);