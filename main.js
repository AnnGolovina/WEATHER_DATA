const cityInput = document.querySelector("#city");
const submitButton = document.querySelector("#submit");
const weatherDataSection = document.querySelector("#weather-data");
const loadingSection = document.querySelector("#loading-section");

const requestOptions = { method: "GET" };

const API_KEY = `6409ee75b6ffc020adb31a565296a4bb`;
const errorStatuses = ["404", "401"];

let isLoading = false;

const lastRequestData = localStorage.getItem("weather-data")
  ? JSON.parse(localStorage.getItem("weather-data"))
  : undefined;

lastRequestData && renderWeather(lastRequestData);
const infoArray = [];
//const lastRequestedCity = localStorage.getItem("city");
//lastRequestedCity && getWeather(lastRequestedCity);

function getWeather(city) {
  isLoading = true;
  renderLoading(isLoading);

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
    requestOptions
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response, "response");

      if (errorStatuses.includes(response.cod)) {
        return renderError(response);
      }

      localStorage.setItem("city", city);
      localStorage.setItem("weather-data", JSON.stringify(response));

      infoArray.push(response);
      console.log(infoArray);

      renderWeather(response);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      isLoading = false;
      renderLoading(isLoading);
    });
}

submitButton.onclick = () => {
  getWeather(cityInput.value);
};

function renderError(error) {
  weatherDataSection.innerHTML = `<h3>${error.message}</h3>`;
}

function renderLoading(isLoading) {
  loadingSection.innerHTML = isLoading ? `<h3>Loading...</h3>` : "";
}

function renderWeather(data) {
  const { main, wind, sys, name } = data;
  const { temp, temp_max, temp_min, pressure } = main;
  const { speed, deg, gust } = wind;

  weatherDataSection.innerHTML = "";

  weatherDataSection.innerHTML = `
		<h3>Weather in ${name}</h3>
    <span>Temp: ${temp}C</span>
		<span>Feels like: ${feels_like}C</span>
		<span>Max:${temp_min}C - Min:${temp_max}C</span>
		<span>Pressure: ${pressure}PA</span>
		<h3>Wind</h3>
		<span>Speed: ${speed} m/s</span>
		<span>Direction: ${deg}</span>
		<span>Gust: ${gust}m/s</span>
	`;
}
