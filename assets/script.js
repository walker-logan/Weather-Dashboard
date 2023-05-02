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

  

})