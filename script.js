let cityPopover;
const apiKey = "9d11cfb88ff8a2357116587a4d2ea061";
let history = [];
$(document).ready(function () {
    
    cityPopover = new bootstrap.Popover(document.getElementById("cityInput"), {
        trigger: "manual",
        placement: "bottom",
        container: "body",
        content: "Could not locate the city"
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
            $("#weather-view").html("<p>Type city</p>");
            return;
        }
        $("#weather-view").html("<p>Getting weather for " + city + "...</p>");  
        cityPopover.hide();
        getWeatherCity(city);
        $("#cityInput").val("");
    }); // Sökfunktion end

    // My location-knapp
    $("#locationBtn").on("click", function () {
        if (!navigator.geolocation) {
            $("#weather-view").html("<p>Your browser does not support this functionilty.</p>");
            return;
        } // Geolocation supported end
        $("#weather-view").html("<p>Getting your location</p>");

        navigator.geolocation.getCurrentPosition(
            function (position) {
            // om platsen hämtas
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                getWeatherLocation(lat, lon);
            },
            function (error) {
            // om platsen ej kan hämtas
                $("#weather-view").html("<p>Could not get your location</p>");
            }); 
    });
}); // Document ready end

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
        });
    }
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
                    <p>Temp: ${data.main.temp} °C       </p>
                    <p>Vind: ${data.wind.speed} m/s     </p>
                    <p>${data.weather[0].description}   </p>
                </div>
            </div>
        </div>
    `; $("#weather-view").html(html);
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
                "<p>Could not find your current location</p>"
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
    localStorage.setItem("Latest requests", JSON.stringify(history));
    showHistory();
}
// Visa historik
function showHistory() {
    $("#history-view").html("<h2>Latest requests</h2>");
    history.forEach(function(item) {
        const iconUrl = "https://openweathermap.org/img/wn/" + item.icon + "@2x.png";

        $("#history-view").append(`
            <div class="row justify-content-center mb-3"> 
                <div class="col-12 col-md-10">
                    <div class="history-item d-flex align-items-center justify-content-between p-3 shadow rounded">
                        <img src="${iconUrl}" alt="Icon">
                        <p class="mb-0">${item.city}        </p>
                        <p class="mb-0">${item.temp} °C     </p>
                        <p class="mb-0">${item.wind} m/s    </p>
                    </div>
                </div>
            </div>
        `);
    });
}