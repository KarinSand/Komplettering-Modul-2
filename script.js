let cityPopover;
const apiKey = "9d11cfb88ff8a2357116587a4d2ea061";
let history = [];
$(document).ready(function () {
    
    cityPopover = new bootstrap.Popover(document.getElementById("cityInput"), {
        trigger: "manual",
        placement: "bottom",
        content: "We couldn't find the city, try again!"
    });

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
            $("#weather-view").empty();
        
            cityPopover.show();
        
            setTimeout(function () {
                cityPopover.hide();
            }, 3000);
        });}
// Visa vädret
function showWeather(data) {
    const iconName = data.weather[0].icon;
    const iconUrl = "https://openweathermap.org/img/wn/" + iconName + "@2x.png";

    const html = `
        <div class="row justify-content-center">
            <div class="col-12 col-md-10">
                <div class="weather-card d-flex align-items-center justify-content-between p-4 shadow rounded">
                    <img src="${iconUrl}" alt="${data.weather[0].description}">
                    <h2>${data.name}</h2>
                    <p>Temperatur: ${data.main.temp} °C</p>
                    <p>Vind: ${data.wind.speed} m/s</p>
                    <p>${data.weather[0].description}</p>
                </div>
            </div>
        </div>
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
// Lägg till historik
function addToHistory(data) {

    const search = {
        city: data.name,
        temp: data.main.temp,
        wind: data.wind.speed,
        icon: data.weather[0].icon
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
    $("#history-view").html("<h2>Senaste sökningar</h2>");
    history.forEach(function(item) {
        const iconUrl = "https://openweathermap.org/img/wn/" + item.icon + "@2x.png";

        $("#history-view").append(`
            <div class="history-item">
                <img src="${iconUrl}" alt="Weather icon">
                <p>${item.city}</p>
                <p>${item.temp} °C</p>
                <p>${item.wind} m/s</p>
            </div>
        `);
    });
}