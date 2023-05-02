// api key
const apiKey = "2f5f412b8dc65ace9365b098b7f6537d";

// DOM elements
const searchButton = $("button");
const searchBar = $(".search-bar");
const locationElem = $("#location");
const currentConditionElem = $("#current-condition");
const currentTemperatureElem = $("#current-temperature");
const currentHumidityElem = $("#current-humidity");
const currentWindspeedElem = $("#current-windspeed");
const weatherForecastElems = $(".weather-forecast-item");

// helper function to conver kelvin to fahrenheit (had to look this one up on stack overflow)
function kelvinToFahrenheit(kelvin) {
  return ((kelvin - 273.15) * 9) / 5 + 32;
}

// updating weather display
function updateWeatherDisplay(data) {
  // getting city name and weather data list from response
  const cityName = data.city.name;
  const { list } = data;

  // updating current weather info
  locationElem.text(cityName);
  currentConditionElem.text(list[0].weather[0].description);
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
    const iconId = forcast.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconId}.png`;
    // updating DOM elements for the forecast
    weatherForecastElems.eq(i).find(".day").text(day);
    weatherForecastElems.eq(i).find("img").attr("src", iconUrl);
    weatherForecastElems.eq(i).find("#day-" + (i + 1)).text(kelvinToFahrenheit(forecast.main.temp).toFixed(1) + "°F");
    weatherForecastElems.eq(i).find("#night-" + (i + 1)).text(kelvinToFahrenheit(forecast.main.temp_min).toFixed(1) + "°F");
    weatherForecastElems.eq(i).find("#humidity-" + (i + 1)).text(forecast.main.humidity + "%");
    weatherForecastElems.eq(i).find("#windspeed-" + (i + 1)).text(forecast.wind.speed + " mph");
  }
}
