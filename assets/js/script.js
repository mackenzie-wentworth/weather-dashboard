// Clear Local storage
localStorage.clear();

const degreeFahrenheit = "°F";
let citySearchHistory = [];
let previousCitySearch = "";

function openWeatherMap(city) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ce39e7239416ad754359ca762d28521a&units=imperial";

    fetch(apiUrl)

        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    handleWeatherData(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })

        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        })
};


function handleWeatherData(weatherData) {

    todayWeatherCard(weatherData);

    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData.name + "&appid=ce39e7239416ad754359ca762d28521a&units=imperial")
        .then(function (response) {
            response.json().then(function (fiveDayData) {

                $(".card-deck").empty();
                fiveDayDeck(fiveDayData);


            })
        });

    previousCitySearch = weatherData.name;


    saveLocalStorage(weatherData.name);


};

function saveLocalStorage(cityData) {
    if (!citySearchHistory.includes(cityData)) {
        citySearchHistory.push(cityData);
        // $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + cityData + "'>" + cityData + "</a>")

        $(".dropdown-menu").append("<a href='#' class='dropdown-item' id='" + cityData + "'>" + cityData + "</a>");

    }

    localStorage.setItem("weatherSearchHistory", JSON.stringify(citySearchHistory));

    localStorage.setItem("lastCitySearched", JSON.stringify(previousCitySearch));

    loadLocalStorage();
};

function loadLocalStorage() {
    citySearchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory"));
    previousCitySearch = JSON.parse(localStorage.getItem("lastCitySearched"));

    if (!citySearchHistory) {
        citySearchHistory = []
    }

    if (!previousCitySearch) {
        previousCitySearch = ""
    }

    $("#search-history").empty();

    for (i = 0; i < citySearchHistory.length; i++) {

        // $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + citySearchHistory[i] + "'>" + citySearchHistory[i] + "</a>");
        $(".dropdown-menu").append("<a href='#' class='dropdown-item' id='" + citySearchHistory[i] + "'>" + citySearchHistory[i] + "</a>");
    }
};

loadLocalStorage();

if (previousCitySearch != "") {
    openWeatherMap(previousCitySearch);
}

$("#search-history").on("click", function (event) {
    let prevCity = $(event.target).closest("a").attr("id");
    openWeatherMap(prevCity);
});


// submit event
$("#city-search").submit(function (event) {
    // stop page from refreshing
    event.preventDefault();

    let cityResult = $("#cityResult").val().trim();

    console.log("seleced " + cityResult);

    if (cityResult) {
        openWeatherMap(cityResult);

        $("#cityResult").val("");
    } else {
        alert("Please enter a city name");
    }
});


function todayWeatherCard(weatherData) {
    $("#today-city").text(weatherData.name + " (" + dayjs(weatherData.dt * 1000).format("MM/DD/YYYY") + ") ").append(`<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`);
    $("#today-temp").text("Temperature: " + weatherData.main.temp.toFixed(1) + ` ` + degreeFahrenheit);
    $("#today-wind").text("Wind Speed: " + weatherData.wind.speed.toFixed(1) + " MPH");
    $("#today-humid").text("Humidity: " + weatherData.main.humidity + "%");
}

function fiveDayDeck(weatherData) {
    var cardDeck = $(".card-deck");
    cardDeck.empty();

    console.log(weatherData);

    for (i = 7; i <= weatherData.list.length; i += 8) {

        let forecastCard = `
                    <div class="col-md-2 m-2 py-3 card fiveDay">
                        <div class="card-body p-1">
                            <h5 class="card-title">` + dayjs(weatherData.list[i].dt * 1000).format("MM/DD/YYYY") + `</h5>
                            <img src="https://openweathermap.org/img/wn/` + weatherData.list[i].weather[0].icon + `.png" alt="rain">
                            <p class="card-text">Temp: ` + weatherData.list[i].main.temp + ` ` + degreeFahrenheit + `</p>
                            <p class="card-text">Wind: ` + weatherData.list[i].wind.speed +  ` MPH</p>
                            <p class="card-text">Humidity: ` + weatherData.list[i].main.humidity + `</p>
                        </div>
                    </div>
                    `;

        cardDeck.append(forecastCard);
    }
}

