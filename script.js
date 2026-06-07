const apiKey = "9d11cfb88ff8a2357116587a4d2ea061";
let history = [];
$(document).ready(function () {

    // Sökfunktion
    $("#searchForm").on("submit", function (event) {
        event.preventDefault();
        const city = $("#cityInput").val().trim();
        if (city === "") {
            $("#weather-view").html("<p>Skriv in en stad först.</p>");
            return;
        }

        $("#weather-view").html("<p>Hämtar väder för " + city + "...</p>");
        getWeatherCity(city);
    });
    // My location-knapp
    $("#locationBtn").on("click", function () {
        if (!navigator.geolocation) {
            $("#weather-view").html("<p>Din webbläsare stödjer inte platsfunktion.</p>");
            return;
        }
        $("#weather-view").html("<p>Hämtar din plats...</p>");

        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            getWeatherLocation(lat, lon);
        });
    });
});
// Hämta väder för stad
function getWeatherCity(city) {

    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=sv&appid=${apiKey}`;

    $.getJSON(url)
        .done(function (data) {
            showWeather(data);
            addToHistory(data);
        })
        .fail(function () {

            $("#weather-view").html(
                "<p>Kunde inte hitta staden.</p>"
            );
        });
}
// Visa vädret
function showWeather(data) {

    const html = `
        <h2>${data.name}</h2>
        <p>Temperatur: ${data.main.temp} °C</p>
        <p>Vind: ${data.wind.speed} m/s</p>
        <p>${data.weather[0].description}</p>
    `;
    $("#weather-view").html(html);
}
// Hämta väder med koordinater
function getWeatherLocation(lat, lon) {
    const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=sv&appid=${apiKey}`;

    $.getJSON(url)
        .done(function (data) {

            showWeather(data);
            addToHistory(data);
        })
        .fail(function () {
            $("#weather-view").html(
                "<p>Kunde inte hämta vädret för din plats.</p>"
            );
        });
}
// Lägg till i historik
function addToHistory(data) {

    const search = {
        city: data.name,
        temp: data.main.temp,
        wind: data.wind.speed
    };

    history.unshift(search);
    showHistory();
}
// Visa historik
function showHistory() {
    let html = "<h2>Senaste sökningar</h2>";
    history.forEach(function (item) {

        html += `
            <div class="history-item">
                <p>${item.city}</p>
                <p>${item.temp} °C</p>
                <p>${item.wind} m/s</p>
            </div>
        `;

    });
    $("#history-view").html(html);
}