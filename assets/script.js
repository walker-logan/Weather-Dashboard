// api keys
const apiKey = "2f5f412b8dc65ace9365b098b7f6537d";
const unsplashApiKey = "cWeAMr7JoG5aX85EOYSNS2YD2ryQtCqxUWSRwAhfs-M";

// DOM elements
const searchButton = $("button");
const searchBar = $(".search-bar");
document
  .querySelector(".search-bar")
  .addEventListener("keydown", handleKeyPress);
const locationElem = $("#location");
const currentConditionElem = $("#current-condition");
const currentTemperatureElem = $("#current-temperature");
const currentHighTemperatureElem = $("#current-high-temperature");
const currentLowTemperatureElem = $("#current-low-temperature");
const currentHumidityElem = $("#current-humidity");
const currentWindspeedElem = $("#current-windspeed");
const weatherForecastElems = $(".weather-forecast-item");

// helper function to conver kelvin to fahrenheit (had to look this one up on stack overflow)
function kelvinToFahrenheit(kelvin) {
  return ((kelvin - 273.15) * 9) / 5 + 32;
}

function updateWeatherDisplay(data) {
  // getting city name and weather data list from response
  const cityName = data.city.name;
  const { list } = data;

  // updating current weather info
  locationElem.text(cityName);
  currentConditionElem.text(list[0].weather[0].description);

  const currentIconId = list[0].weather[0].icon;
  const currentIconUrl = `http://openweathermap.org/img/wn/${currentIconId}.png`;
  $("#current-icon").attr("src", currentIconUrl);

  currentTemperatureElem.text(
    kelvinToFahrenheit(list[0].main.temp).toFixed(1) + "°F"
  );
  currentHumidityElem.text(list[0].main.humidity + "%");
  currentWindspeedElem.text(list[0].wind.speed + " mph");

  // loop for updating 5-day forecast
  for (let i = 0; i < 5; i++) {
    // getting weather data for the day (8 points per day * 5 day forecast)
    const forecast = list[i * 8];
    // formatting the date as a weekday abbreviation
    const date = new Date(forecast.dt_txt);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    // getting weather icon
    const iconId = forecast.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconId}.png`;
    // updating DOM elements for the forecast using find and a loop to find the id and appending it.
    weatherForecastElems.eq(i).find(".day").text(day);
    weatherForecastElems.eq(i).find("img").attr("src", iconUrl);
    weatherForecastElems
      .eq(i)
      .find("#temp-" + (i + 1))
      .text(
        "Temp: " + kelvinToFahrenheit(forecast.main.temp).toFixed(1) + "°F"
      );
    weatherForecastElems
      .eq(i)
      .find("#humidity-" + (i + 1 + 1))
      .text("Humidity: " + forecast.main.humidity + " %");
    weatherForecastElems
      .eq(i)
      .find("#windspeed-" + (i + 1 + 1))
      .text("Windspeed: " + forecast.wind.speed + " mph");
  }
}

// function to actually grab the weather data and then display it using .get and one promise
function fetchWeatherData(cityName) {
  const cityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

  // fetch the background image from Unsplash
  const unsplashUrl = `https://api.unsplash.com/search/photos?query=${cityName}&client_id=${unsplashApiKey}&per_page=1&orientation=landscape`;

  // fetch both the weather data and the unsplash image
  Promise.all([$.get(cityUrl), $.get(unsplashUrl)])
    .then((responses) => {
      const weatherData = responses[0];
      const unsplashData = responses[1];

      // extracting lat and lon from weather data
      const lat = weatherData.coord.lat;
      const lon = weatherData.coord.lon;
      // creating url for the api request using lat and lon
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      // updating the background image
      const imageUrl = unsplashData.results[0]?.urls.regular;
      if (imageUrl) {
        $(".card").css("background-image", `url(${imageUrl})`);
        $(".weather-forecast-item").css("background-image", `url(${imageUrl})`);
      }

      // fetch the forecast data and update the weather display
      return $.get(weatherUrl);
    })
    .then((data) => {
      updateWeatherDisplay(data);
    })
    .catch((error) => {
      // logging the error and displaying an alert message if there was an issue fetching the weather data
      console.error(error);
      alert("Error fetching weather data. Please try again.");
    });
}

function loadSavedCitiesAndFetchWeather() {
  const savedCityNames = JSON.parse(localStorage.getItem("cityNames")) || [];
  if (savedCityNames.length > 0) {
    $("#saved-cities").empty();
    savedCityNames.forEach((cityName) => {
      const cityElement = $(`<a>${cityName}</a>`);
      cityElement.click(function () {
        fetchWeatherData(cityName);
      });
      $("#saved-cities").append(cityElement);
    });
    fetchWeatherData(savedCityNames[savedCityNames.length - 1]);
  } else {
    fetchWeatherData("Austin");
  }
}

$(document).ready(loadSavedCitiesAndFetchWeather);

searchButton.click(function () {
  const cityName = searchBar.val().trim();
  if (cityName) {
    searchBar.val("");
    let savedCities = JSON.parse(localStorage.getItem("cityNames")) || [];
    if (!savedCities.includes(cityName)) {
      savedCities.push(cityName);
      localStorage.setItem("cityNames", JSON.stringify(savedCities));
      const cityElement = $(`<a>${cityName}</a>`);
      cityElement.click(function () {
        fetchWeatherData(cityName);
      });
      $("#saved-cities").append(cityElement);
    }
    fetchWeatherData(cityName);
    loadSavedCitiesAndFetchWeather();
  }
});

function handleKeyPress(e) {
  if (e.key === "Enter") {
    const cityName = searchBar.val().trim();
    if (cityName) {
      searchBar.val("");
      let savedCities = JSON.parse(localStorage.getItem("cityNames")) || [];
      if (!savedCities.includes(cityName)) {
        savedCities.push(cityName);
        localStorage.setItem("cityNames", JSON.stringify(savedCities));
        $("#saved-cities").append(`<a>${cityName}</a>`);
      }
      fetchWeatherData(cityName);
      loadSavedCitiesAndFetchWeather();
    }
  }
}
