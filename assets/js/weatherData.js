//class for handling weather data
class weatherData {
    constructor(name, date, weatherDesc, temperature, windSpeed, humidity, uvi, iconString) {
        this.name = name;
        this.date = date;
        this.weatherDesc = weatherDesc;
        this.temperature = temperature;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
        this.uvi = uvi;
        this.iconString = iconString;
    }

    iconUrl(multiplier) {
        const iconURLBase = "http://openweathermap.org/img/w/";
        var sizingMultiplierText = "";
        if (!isNaN(multiplier) && Math.floor(multiplier) === multiplier) {
            //parseInt just incase the number passed is a decimal number
            sizingMultiplierText = "@" + parseInt(multiplier) + "x";
        }

        return iconURLBase + this.iconString + sizingMultiplierText + ".png";
    }
}