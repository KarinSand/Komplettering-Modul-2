const apiKey = "9d11cfb88ff8a2357116587a4d2ea061";
let history = [];
$(document).ready(function () {

    const savedHistory = localStorage.getItem("weatherHistory");
    if (savedHistory !== null) {
        history = JSON.parse(savedHistory);
        showHistory();
    }
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
        $("#cityInput").val("");
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

    const iconName = data.weather[0].icon;
    const iconUrl = "https://openweathermap.org/img/wn/" + iconName + "@2x.png";
    const html = `
        <div class="weather-card">
            <img src="${iconUrl}" alt="${data.weather[0].description}">
            <h2>${data.name}</h2>
            <p>Temperatur: ${data.main.temp} °C</p>
            <p>Vind: ${data.wind.speed} m/s</p>
            <p>${data.weather[0].description}</p>
        </div>
    `;

    $("#weather-view").html(html); // visa vädret i #weather-view
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
// Lägg till historik
function addToHistory(data) {

    const search = {
        city: data.name,
        temp: data.main.temp,
        wind: data.wind.speed
    };
    history.unshift(search);
    if (history.length > 5) {
        history.pop();
    }
    localStorage.setItem("weatherHistory", JSON.stringify(history));
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