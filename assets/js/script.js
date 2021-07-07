const searchInput = $("#searchInput");
const searchBtn = $("#searchBtn");

const weatherBaseUrl = "https://api.openweathermap.org/data/2.5/weather";
const oneCallBaseUrl = "https://api.openweathermap.org/data/2.5/onecall"
const apiKey = "e8139ecc4a08593710c9d15bc25fe6a5";

var cityList = [];
var cityListButtonElements;
var todaysWeatherElements;
var fiveDayForecastElements;

//#region localStorageHandling
//---------------------------------------
function getLocalStorage() {
    var localStorageCityList = JSON.parse(localStorage.getItem("cityList"));

    //Is this the first time we're running?
    if (localStorageCityList === null) {
        defaultCityList();
        setLocalStorage();
    } else {
        cityList = localStorageCityList;
    }
}

function setLocalStorage() {
    localStorage.setItem("cityList", JSON.stringify(cityList));
}
//---------------------------------------
//#endregion localStorageHandling


//#region cityList_Manipulation
//---------------------------------------
function defaultCityList() {
    updateCityList("Detroit");
}

function updateCityList(city) {
    //if the list already contains this city, do nothing!
    if (cityList.find(x => x == city) != null) {
        return;
    }
    
    //add new item
    cityList.unshift(city);

    //remove item in position 6, if any
    if (cityList.length > 5) {
        cityList.pop();
    }

    setLocalStorage();
}
//---------------------------------------
//#endregion cityList_Manipulation


//#region API-functions
//---------------------------------------
//returns the API response, after taking in a city name.
async function getCoordsFromCity(cityName) {
    //this works much more intuitively for me than the fetch .then() method taught in class
    var weatherResponse = await fetch(weatherBaseUrl + "?q=" + cityName + "&units=imperial&appid=" + apiKey);
    var theWeatherData = await weatherResponse.json();
        
    var lat, lon, name;
    
    lat = theWeatherData.coord.lat;
    lon = theWeatherData.coord.lon;
    name = theWeatherData.name;
    
    getFullWeatherReport(lat, lon, name);
}

//taking in latitude and longitude coords, gets data for full weather report
async function getFullWeatherReport(lat, lon, name) {
    var weatherResponse = await fetch(oneCallBaseUrl + "?units=imperial&lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&appid=" + apiKey);
    var theWeatherData = await weatherResponse.json();

    //use moment to handle dates effectively
    var currentDate = moment();

    var todaysWeatherObj = new weatherData(
        name,
        currentDate.format("L"),
        theWeatherData.current.weather[0].description,
        theWeatherData.current.temp,
        theWeatherData.current.wind_speed,
        theWeatherData.current.humidity,
        theWeatherData.current.uvi,
        theWeatherData.current.weather[0].icon
    )

    var fiveDayForecast = [null, null, null, null, null];
    for (var i = 0; i < fiveDayForecast.length; i++) {
        //moment.js mutability will always screw me up.
        var forecastDate = currentDate.add(1,'days');

        fiveDayForecast[i] = new weatherData(
            name,
            forecastDate.format("L"),
            theWeatherData.daily[i].weather[0].description,
            theWeatherData.daily[i].temp,
            theWeatherData.daily[i].wind_speed,
            theWeatherData.daily[i].humidity,
            theWeatherData.daily[i].uvi,
            theWeatherData.daily[i].weather[0].icon
        )
    }

    displayWeather(todaysWeatherObj, fiveDayForecast);

}
//---------------------------------------
//#endregion API-functions

//#region jquery-removes
//---------------------------------------
function removeListButtons() {
    if (cityListButtonElements != null) {
        cityListButtonElements.remove();
    }
}

function removePreviousWeather() {
    if (todaysWeatherElements != null) {
        todaysWeatherElements.remove();
    }
    if (fiveDayForecastElements != null) {
        fiveDayForecastElements.remove();
    }
}

//---------------------------------------
//#endregion jquery-removes


//#region jquery-appends
//---------------------------------------
function addListButtons() {
    
    var containerEl = $("#cityButtonContainer");
    var buttonDivEl = $(`<div class="container-fluid"></div>`);
    for (var i = 0; i < cityList.length; i++) {
        var buttonEl = $(`
            <div class="row">
                <button class="previousSearch btn btn-primary">${cityList[i]}</button>
            </div>
            <br>
            `);
        buttonDivEl.append(buttonEl);
    }

    containerEl.append(buttonDivEl);

    $(".previousSearch").on("click", function(event) {
        event.stopPropagation();
        event.preventDefault();
        var sender = event.target;
        generateWeatherReport(sender.textContent);
    })

    removeListButtons();
    cityListButtonElements = buttonDivEl;
}

function displayWeather(currentWeatherObj, fiveDayForecastArray) {
    console.log(currentWeatherObj, fiveDayForecastArray);

    //Today's forecast
    var todaysWeatherDiv = $(`<div class="container-fluid"></div>`);
    var title = $(`<h3>${currentWeatherObj.name + " | " + currentWeatherObj.date}</h3>`);
    var weatherIcon = $(`<img alt="Today's weather" src="${currentWeatherObj.iconUrl()}"></img>`);
    var weatherStats = $(`<p>
        <b>${currentWeatherObj.weatherDesc}</b><br>
        Temp: ${currentWeatherObj.temperature}°F<br>
        Wind Speed: ${currentWeatherObj.windSpeed}MPH<br>
        Humidity: ${currentWeatherObj.humidity}%<br>
        UV Index: ${currentWeatherObj.uvi}<br>
    </p>`);

    //append today's forecast
    todaysWeatherDiv.append(title);
    todaysWeatherDiv.append(weatherIcon);
    todaysWeatherDiv.append(weatherStats);
    $("#dailyContainer").append(todaysWeatherDiv);

    //5-day forecast
    var fiveDayForecastDiv = $(`<div class="container-fluid"></div>`);
    for (var i = 0; i < fiveDayForecastArray.length; i++) {
        var currentDay = fiveDayForecastArray[i];

        var dayContainer = $(`<div class="card"></div>`);
        var title = $(`<h3 class="card-title">${currentDay.date}</h3>`);
        var weatherIcon = $(`<img alt="Future weather" src="${currentDay.iconUrl()}"></img>`);
        var weatherStats = $(`<p class="card-text">
            <b>${currentDay.weatherDesc}</b><br>
            Temp: ${currentDay.temperature.day}°F<br>
            Wind Speed: ${currentDay.windSpeed}MPH<br>
            Humidity: ${currentDay.humidity}%<br>
            UV Index: ${currentDay.uvi}<br>
        </p>`);

        dayContainer.append(title);
        dayContainer.append(weatherIcon);
        dayContainer.append(weatherStats);
        fiveDayForecastDiv.append(dayContainer);
    }

    $("#fiveDayContainer").append(fiveDayForecastDiv);

    //remove old weather reports, assign current reports
    removePreviousWeather();
    todaysWeatherElements = todaysWeatherDiv;
    fiveDayForecastElements = fiveDayForecastDiv;
}
//---------------------------------------
//#endregion jquery-appends



function generateWeatherReport(cityName) {
    getCoordsFromCity(cityName);
}

searchBtn.click(function(event) {
    event.preventDefault();
    var inputText = searchInput.val();
    if (inputText != "") {
        updateCityList(inputText);
        addListButtons();
        generateWeatherReport(inputText);
    }
})

function init() {
    getLocalStorage();

    addListButtons();

    //var temp = getCoordsFromCity(cityList[0]);
}

init();