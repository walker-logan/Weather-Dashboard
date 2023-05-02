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
      .find("#day-" + (i + 1))
      .text(kelvinToFahrenheit(forecast.main.temp).toFixed(1) + "°F");
    weatherForecastElems
      .eq(i)
      .find("#night-" + (i + 1))
      .text(kelvinToFahrenheit(forecast.main.temp_min).toFixed(1) + "°F");
    weatherForecastElems
      .eq(i)
      .find("#humidity-" + (i + 1))
      .text(forecast.main.humidity + "%");
    weatherForecastElems
      .eq(i)
      .find("#windspeed-" + (i + 1))
      .text(forecast.wind.speed + " mph");
  }
}

// function to actually grab the weather data and then display it using .get and one promise
function fetchWeatherData(cityName) {
  const cityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

  // Fetch the background image from Unsplash
  const unsplashUrl = `https://api.unsplash.com/search/photos?query=${cityName}&client_id=${unsplashApiKey}&per_page=1&orientation=landscape`;

  // Fetch both the weather data and the Unsplash image
  Promise.all([$.get(cityUrl), $.get(unsplashUrl)])
    .then((responses) => {
      const weatherData = responses[0];
      const unsplashData = responses[1];

      // extracting lat and lon from weather data
      const lat = weatherData.coord.lat;
      const lon = weatherData.coord.lon;
      // creating url for the api request using lat and lon
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      // Update the background image
      const imageUrl = unsplashData.results[0]?.urls.regular;
      if (imageUrl) {
        $("body").css("background-image", `url(${imageUrl})`);
      }

      // Fetch the forecast data and update the weather display
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

// function to make keyboard event for "enter"
function handleKeyPress(e) {
  if (e.key === "Enter") {
    const cityName = searchBar.val().trim();
    if (cityName) {
      searchBar.val("");
      fetchWeatherData(cityName);
    }
  }
}

searchBar.on("keydown", handleKeyPress);

// event listener for the search button click event
searchButton.on("click", () => {
  // getting the city name entered in the search bar and trim any leading/trailing whitespace (this was also stack overflow)
  const cityName = searchBar.val().trim();
  if (cityName) {
    searchBar.val("");
    fetchWeatherData(cityName);
    // clearing the search bar
  } else {
    // displaying an alert if no city name was entered
    alert("Please enter a city name.");
  }
});

// fetch and display the weather data for austin as the default city when the page loads
fetchWeatherData("Austin");
