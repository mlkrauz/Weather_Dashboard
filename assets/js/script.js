const searchInput = $("#searchInput");
const searchBtn = $("#searchBtn");

const weatherBaseUrl = "https://api.openweathermap.org/data/2.5/weather";
const oneCallBaseUrl = "https://api.openweathermap.org/data/2.5/onecall"
const apiKey = "e8139ecc4a08593710c9d15bc25fe6a5";

var cityList = [];
var cityListButtonElements;

//#region localStorageHandling
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
//#endregion localStorageHandling

//#region cityList_Manipulation
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
//#endregion cityList_Manipulation

//#region API-functions
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

    var todaysWeatherObj = new weatherData(
        name,
        theWeatherData.current.weather[0].description,
        theWeatherData.current.temp,
        theWeatherData.current.wind_speed,
        theWeatherData.current.humidity,
        theWeatherData.current.uvi,
        theWeatherData.current.weather[0].icon
    )

    var fiveDayForecast = [5];
    for (var i = 0; i < fiveDayForecast.length; i++) {
        fiveDayForecast[i] = new weatherData(
            name,
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
//#endregion API-functions

//#region jquery-appends

function removeListButtons() {
    if (cityListButtonElements != null) {
        cityListButtonElements.remove();
    }
}

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
    //console.log(currentWeatherObj, fiveDayForecastArray);
}
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