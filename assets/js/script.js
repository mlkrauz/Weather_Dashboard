const searchInput = $("#searchInput");
const searchBtn = $("#searchBtn");
const apiKey = "e8139ecc4a08593710c9d15bc25fe6a5";

var cityList = [];

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
    cityList.unshift("Detroit, MI");
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

function init() {
    getLocalStorage();
}

init();