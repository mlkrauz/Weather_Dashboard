//class for handling weather data
class weatherData {
    constructor(name, weatherDesc, temperature, windSpeed, humidity, uvi, iconString) {
        this.name = name;
        this.weatherDesc = weatherDesc;
        this.temperature = temperature;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
        this.uvi = uvi;
        this.iconString = iconString;
    }

    iconURl(multiplier) {
        const iconURLBase = "http://openweathermap.org/img/w/";
        var sizingMultiplierText = "";
        if (!isNaN(multiplier) && Math.floor(multiplier) === multiplier) {
            //parseInt just incase the number passed is a decimal number
            sizingMultiplierText = "@" + parseInt(multiplier) + "x";
        }

        return iconURLBase + this.iconString + sizingMultiplierText + ".png";
    }
}