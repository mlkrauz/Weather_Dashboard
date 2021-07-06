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
    console.log(cityName);
    var weatherResponse = await fetch(weatherBaseUrl + "?q=" + cityName + "&appid=" + apiKey);
    var weatherData = await weatherResponse.json();
        
    var lat, lon, name;
    
    lat = weatherData.coord.lat;
    lon = weatherData.coord.lon;
    name = weatherData.Name;
    
    getFullWeatherReport(lat, lon, name);
}

//returns the API reponse, after taking in latitude and longitude coords
async function getFullWeatherReport(lat, lon, name) {
    var weatherResponse = await fetch(oneCallBaseUrl + "?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&appid=" + apiKey);
    var weatherData = await weatherResponse.json();

    console.log(weatherData);
}
//#endregion API-functions

//#region jquery-appends

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
    cityListButtonElements = containerEl;

    $(".previousSearch").on("click", function(event) {
        //event.stopPropagation();
        var sender = event.target;
        generateWeatherReport(sender.textContent);
    })
}
//#endregion jquery-appends

function generateWeatherReport(cityName) {
    getCoordsFromCity(cityName);
}

searchBtn.click(function() {
    var inputText = searchInput.val();
    console.log(inputText);
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