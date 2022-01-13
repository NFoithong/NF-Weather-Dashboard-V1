// User story

// AS A traveler
// I WANT to see the weather outlook for multiple cities
// SO THAT I can plan a trip accordingly

// Acceptance criteria

// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

var cityInput = $(".search-input");
var currentCity = $('#currentcity');
var tempEl = $('#temperature');
var humidityEl = $('#humidity');
var windEl = $('#wind');
var uvIdx = $('#uv-index');
var imgIcon = $('#weathericon');
var uvSpanEl = $("#uvspan");
var forecast = $(".forecast");
var city = "";




const apiUrl = '570577608c6e63cd2a8db048c380cdd1';

// WHEN I type city name in search input and search button click
// Function to get and display the current conditions on Open Weather Maps
$(document).ready(function() {

    function getCurrentWeather() {

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiUrl;

        // starting a fetch request for the openweather APi
        fetch(queryURL)
            .then(function(response) {
                return response.json();
                // console.log(response);
            })
            .then(function(data) {
                console.log(data);

                var currentDate = moment().format('l');
                var temFar = Math.round((((data.temp - 273.15) * 1.8) + 32) * 10) / 10; // this variable is used to convert the temperature from kelvin to fahrenheit and round it to one decimal.
                var latitute = data.lat; // This variable will be used to store the latitude of the current city.
                var longitude = data.lon; // This variable will be used to store the longitude of the current city.
                var WeatherIcon = data.weather[0].icon; //This line is used to fetch the weather icon

                currentCity.text(data.name + " (" + currentDate + ")");
                tempEl.text("temperature:" + temFar + ' °F');
                humidityEl.text("humidity:" + data.main.humidity + '%');
                windEl.text('wind: ' + data.wind.speed + 'MPH');
                imgIcon.attr("src", "https://openweathermap.org/img/wn/" + WeatherIcon + ".png");
                imgIcon.attr("alt", data.weather[0].description);
                imgIcon.attr('id', "imgIcon");

                //Starting a second fetch request for to obtain the UV from the open weather API.
                var uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitute + "&lon=" + longitude + "&appid=" + apiUrl;
                fetch(uvURL)
                    .then(function(response) {
                        // console.log("UV" + reponse);
                        return response.json();
                    })
                    .then(function(data) {
                        var currentUV = data.value;
                        uvSpanEl.text(currentUV);
                        // this if statement will add a background color to the value of the current uv index based on how high the uv is.
                        if (currentUV < 3) {
                            uvSpanEl.addClass("lowuv");
                        } else if (currentUV < 7) {
                            uvSpanEl.addClass("highuv");
                        } else {
                            uvSpanEl.addClass("veryhighuv");
                        }

                        // uvIdx.text('UV: ' +)
                    })

                var cityId = data.id;
                var futureUrl = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityId + "&appid=" + apiUrl;
                fetch(futureUrl)
                    .then(function(response) {
                        console.log(response);
                        return response.json();
                    })
                    .then(function(data) {
                        // console.log(data);
                        for (i = 0; i < 5; i++) {
                            var forecastIndex = i * 8 + 4;
                            var indexDate = new Date(data.list[forecastIndex].dt * 1000); //transform the dt from the API to a day, month and year format.
                            var futureDay = indexDate.getDate();
                            var futureMonth = indexDate.getMonth() + 1;
                            var futureYear = indexDate.getFullYear();

                            var forecastDiv = $("<div>");
                            forecastDiv.addClass("col bg-primary text-white ml-3 ml-b rounded");
                            forecast.append(forecastDiv);

                            var forecastDate = $("<p>");
                            forecastDate.text(futureMonth + "/" + futureDay + "/" + futureYear);
                            forecastDate.addClass("dayforecast");

                            var forecastImg = $("<img>");
                            forecastImg.attr("src", "https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + ".png")
                            forecastImg.attr("alt", data.list[forecastIndex].weather[0].description);

                            var forecastTemp = $("<p>");
                            var tempToF = Math.round((((data.list[forecastIndex].main.temp - 273.15) * 1.8) + 32) * 10) / 10;
                            forecastTemp.text("Temperature: " + tempToF + "°F");
                            forecastTemp.addClass("forecasttemp");

                            var forecastHum = $("<p>");
                            forecastHum.text("Humidity: " + data.list[forecastIndex].main.humidity + "%");
                            forecastHum.addClass("forecasthumidity");


                            forecastDiv.append(forecastDate, forecastImg, forecastTemp, forecastHum);

                        }
                    })
            })
    }
    getCurrentWeather();

    $('.search-button').on('click', function() {
        localStorage.setItem("city", $(cityInput).val());
        cityParse = (localStorage.getItem("city"));
        city = cityParse;
        $(".forecast").empty();
        getCurrentWeather();
    })


})




// $(document).ready(function() {
//     function currentWeather() {
//         var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey; //API URL for the openweather API.
//         fetch(requestUrl) // starting a fetch request for the openweather APi
//             .then(function(response) {
//                 console.log("there is a ", response) //this line of code is used to confirm if there is a response from the fetch request.
//                 return response.json();
//             })
//             .then(function(data) {
//                 console.log(data);
//                 var temperatureF = Math.round((((data.main.temp - 273.15) * 1.8) + 32) * 10) / 10; // this variable is used to convert the temperature from kelvin to fahrenheit and round it to one decimal.
//                 var currentYear = new Date().getFullYear(); // This variable will be used to store the current year.
//                 var currentMonth = new Date().getMonth() + 1; // This variable will be used to store the current month.
//                 var currentDay = new Date().getDate(); // This variable will be used to store the current day.
//                 var latitute = data.coord.lat; // This variable will be used to store the latitude of the current city.
//                 var longitude = data.coord.lon; // This variable will be used to store the longitude of the current city.
//                 var iconId = data.weather[0].icon; //This line is used to fetch the weather icon
//                 currentCityEl.text(data.name + "(" + currentMonth + "/" + currentDay + "/" + currentYear + ")"); //this line of code will add the city name and the current date.
//                 temperatureEl.text("temperature: " + temperatureF + "°F"); // This line of code will give write the temperature for the html element that has an id of temperature.
//                 humidityEl.text("humidity: " + data.main.humidity + "%"); // This line of code will write the humidity level for the html element that has an id of humidity.
//                 windEl.text("wind-speed: " + data.wind.speed + "MPH"); // This line of code will write the wind speed for the html element with an id of wind.
//                 imgEl.attr("src", "https://openweathermap.org/img/wn/" + iconId + ".png"); //This line is used to add a src attribute to the img HTML element.
//                 imgEl.attr("alt", data.weather[0].description); //This line is used to add a description to the img HTML element.
//                 imgEl.attr('id', "wIcon"); //This line is used to add an ID to the newly created img HTML element.

//                 var uvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitute + "&lon=" + longitude + "&appid=" + apiKey;
//                 fetch(uvUrl) //Starting a second fetch request for to obtain the UV from the open weather API.
//                     .then(function(response) {
//                         console.log("UV has a " + response);
//                         return response.json();
//                     })
//                     .then(function(data) {
//                         console.log(data);
//                         var currentUV = data.value;
//                         uvSpanEl.text(currentUV);
//                         if (currentUV < 3) { // this if statement will add a background color to the value of the current uv index based on how high the uv is.
//                             uvSpanEl.addClass("lowuv");
//                         } else if (currentUV < 5) {
//                             uvSpanEl.addClass("moderateuv");
//                         } else if (currentUV < 7) {
//                             uvSpanEl.addClass("highuv");
//                         } else {
//                             uvSpanEl.addClass("veryhighuv");
//                         }
//                     })
//                 var cityId = data.id;
//                 var futureUrl = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityId + "&appid=" + apiKey;
//                 fetch(futureUrl)
//                     .then(function(response) {
//                         console.log(response);
//                         return response.json(); //This line is used transform the response into a Json format.
//                     })
//                     .then(function(data) {
//                         console.log(data);
//                         for (i = 0; i < 5; i++) {
//                             var forecastIndex = i * 8 + 4;
//                             var indexDate = new Date(data.list[forecastIndex].dt * 1000); //transform the dt from the API to a day, month and year format.
//                             var futureDay = indexDate.getDate(); //This line is used to get the current date
//                             var futureMonth = indexDate.getMonth() + 1; //This line is used to get the current month
//                             var futureYear = indexDate.getFullYear(); //this line is used to get the current year
//                             var forecastDiv = $("<div>"); //Create a new div
//                             forecastDiv.addClass("col bg-primary text-white ml-3 ml-b rounded");
//                             forecast.append(forecastDiv); //append the new div to the div with a forecast class
//                             var forecastP = $("<p>"); //Create a new p html element that will be used to contain the date.
//                             forecastP.text(futureMonth + "/" + futureDay + "/" + futureYear); //this line will be used to give the new p html element the different days.
//                             forecastP.addClass("dayforecast"); //add a class of dayforecast for the new p html element.
//                             var forecastImg = $("<img>"); //Create a new img html element
//                             forecastImg.attr("src", "https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + ".png") //this line of code will add a src for the image tag. This is done to obtain the icon for the weather from the openweather API.
//                             forecastImg.attr("alt", data.list[forecastIndex].weather[0].description); //this line of code will add a description to the img html element.
//                             var forecastTemp = $("<p>"); //Create a new p html element this will be used to store the temperature.
//                             var tempToF = Math.round((((data.list[forecastIndex].main.temp - 273.15) * 1.8) + 32) * 10) / 10; //This line is used to transform the temp value from kelvin to fahrenheit.
//                             forecastTemp.text("Temperature: " + tempToF + "°F"); //This line of code is used to add a text value to the p html element created from the var forecastTemp.
//                             forecastTemp.addClass("forecasttemp"); //This line is used to add a class of forecasttemp to the recently create p HTML element from the var forecastTemp.
//                             var forecastHum = $("<p>"); //This line is used to create a new p HTML element and store it on a var called forecastHum.
//                             forecastHum.text("Humidity: " + data.list[forecastIndex].main.humidity + "%"); //This line is used to add the text for the p element from forecastHum.
//                             forecastHum.addClass("forecasthumidity"); //This line is used to add a class to the newly created p HTML element contained within the var forecastHum.
//                             forecastDiv.append(forecastP, forecastImg, forecastTemp, forecastHum); //This line is used to append all the newly created HTML elements to the new forecastDiv created before.
//                         }
//                     })
//             })
//     }
//     currentWeather();
//     $("#searchBtn").on("click", function() {
//         console.log("hello");
//         localStorage.setItem("city", $(cityInput).val());
//         cityParse = (localStorage.getItem("city"));
//         city = cityParse;
//         console.log(city);
//         $(".forecast").empty();
//         currentWeather();
//     })


// })