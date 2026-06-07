const apiKey = "9d11cfb88ff8a2357116587a4d2ea061";
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city === "") {
        return;
    }
    getWeather(city);
});
function getWeatherCity(city) {
    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        });
}
  