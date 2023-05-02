$(document).ready(function () {
  const apiKey = "your_api_key_here";
  const searchButton = $("button");
  const searchBar = $(".search-bar");

  function fetchWeatherData(city) {
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`,
      method: "GET",
    }).then(function (response) {
      const lat = response.coord.lat;
      const lon = response.coord.lon;
      const cityName = response.name;

      $("#location").text(cityName);

      fetchFiveDayForecast(lat, lon);
    });
  }

  function fetchFiveDayForecast(lat, lon) {
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`,
      method: "GET",
    }).then(function (response) {
      const forecastList = response.list;
      for (let i = 0; i < 5; i++) {
        const forecast = forecastList[i * 8];
        const date = new Date(forecast.dt_txt);
        const icon = forecast.weather[0].icon;
        const temp = forecast.main.temp;
        const humidity = forecast.main.humidity;
        const windSpeed = forecast.wind.speed;

        $(`#icon-${i + 1}`).attr("src", `https://openweathermap.org/img/wn/${icon}.png`);
        $(`#${i + 1}-day`).text(`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`);
        $(`#day-${i + 1}`).text(`Day: ${temp.toFixed(1)}°F`);
        $(`#humidity-${i + 1}`).text(`Humidity: ${humidity}%`);
        $(`#windspeed-${i + 1}`).text(`Wind Speed: ${windSpeed} MPH`);
      }
    });
  }

  function handleSearch() {
    const city = searchBar.val().trim();
    if (city === "") return;
    fetchWeatherData(city);
    searchBar.val("");
  }

  searchButton.on("click", handleSearch);
  searchBar.on("keypress", function (event) {
    if (event.key === "Enter") {
      handleSearch();
    }
  });
});
