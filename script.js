const apiKey = "9d11cfb88ff8a2357116587a4d2ea061";

$(document).ready(function () {
    //testing

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

});

function getWeatherCity(city) {
    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=sv&appid=${apiKey}`;

        $.getJSON(url)
        .done(function(data) {
            showWeather(data);
        })
        .fail(function() {
            //  felhantering
            $("#weather-view").html(
                "<p>Kunde inte hitta staden.</p>"
            );
        });
function showWeather(data) {
    const html = `
        <h2>${data.name}</h2>
        <p>Temperatur: ${data.main.temp} °C</p>
        <p>${data.weather[0].description}</p>
    `;
    $("#weather-view").html(html);

}
}