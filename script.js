// Simplified JavaScript Code for Weather App

// DOM Elements
const tableBody = document.getElementById("repo-table");
const cityInput = document.querySelector("#city-text");
const todoForm = document.querySelector("#todo-form");
const todoCity = document.querySelector("#cities");
const todoFiveCities = document.querySelector("#fivedays");
const currentCityDisplay = document.getElementById("nameCity");
const weatherIcon = document.getElementById("iconWea");

// Date Display
document.getElementById("Tdate").innerHTML = moment().format("MMMM Do, YYYY, H a");

// API Key (Consider moving to server-side in production)
const apiKey = "d3cead6b24ef04751594f3f9dfdaba4a";

// Cities Array for Storage
let citiesArray = JSON.parse(localStorage.getItem("citiesArray")) || [];

// Initialize the App
function init() {
  renderCities();
}
init();

// Event Listeners
todoForm.addEventListener("submit", handleCitySubmit);
document.getElementById("cities").addEventListener("click", handleCityClick);

// Functions
function renderCities() {
  todoCity.innerHTML = citiesArray.map(city => `<li><button class="btn-primary btn-lg btn-block">${city}</button></li>`).join('');
}

function handleCitySubmit(event) {
  event.preventDefault();
  const cityText = cityInput.value.trim();
  if (!cityText) return;

  if (citiesArray.length >= 5) citiesArray.shift();
  citiesArray.push(cityText);
  localStorage.setItem("citiesArray", JSON.stringify(citiesArray));

  cityInput.value = "";
  renderCities();
  getWeather(cityText);
}

function handleCityClick(event) {
  if (event.target.tagName === 'BUTTON') {
    getWeather(event.target.textContent);
  }
}

function getWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
    .then(response => response.json())
    .then(data => updateWeatherDisplay(data))
    .catch(error => console.error("Error fetching weather data", error));
}

function updateWeatherDisplay(data) {
  currentCityDisplay.innerHTML = `${data.name}<br> Temperature ${data.main.temp} humidity ${data.main.humidity}<br> Wind speed ${data.wind.speed}`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  getFiveDayForecast(data.coord.lat, data.coord.lon);
}

function getFiveDayForecast(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=alerts&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => createFiveDays(data))
    .catch(error => console.error("Error fetching forecast data", error));
}

function createFiveDays(weatherData) {
  todoFiveCities.innerHTML = weatherData.daily.slice(0, 5).map((day, index) => `
    <ul class="list-group-item">
      <li>Day ${index + 1}</li>
      <li>Temp: ${day.temp.day}</li>
      <li>Wind: ${day.wind_speed}</li>
      <li>Humidity: ${day.humidity}</li>
      <li>UVI: ${day.uvi}</li>
    </ul>
  `).join('');
  $("#fivedays").slideToggle(1000);
}
