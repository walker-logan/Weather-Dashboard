var today = dayjs()
var timeDisplayEl = document.querySelector('.current-time')
var dateDisplayEl = document.querySelector('.current-date')
var cities = JSON.parse(localStorage.getItem("cities")) || [];
var apiKey = "2f5f412b8dc65ace9365b098b7f6537d"

document.querySelector("button").addEventListener("click", function() {
  var userInput = document.querySelector("input").value
  searchWeather(userInput)
})

function displayTime() {
  var rightNow = dayjs().format('	h:mm:ss A');
  timeDisplayEl.textContent = rightNow;
};
displayTime();
setInterval(displayTime, 1000);

function displayDate() {
  var dateNOW = dayjs().format('dddd, MMMM D[,] YYYY');
  dateDisplayEl.textContent = dateNOW;
};
displayDate();
setInterval(displayDate, 24 * 60 * 60 * 1000);

function saveCity() {
  localStorage.setItem("cities", JSON.stringify(cities));
};

function searchWeather(city) {
  var url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
  fetch(url)
  .then(function(res) {
    return res.json()
  })
  .then(function(data) {
    console.log(data)
  })
}

