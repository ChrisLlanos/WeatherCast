//store various constants and assign some jquery var

var apiKey = 'a2f0ca10a73c567ddde6594fbbf3a4e5';
var city = $('input[name="city-to-find"]');
var fetchButtonEl = $("#submitButton");
var todayCardEl = $("#todayForecast");

//get current date to display from js object
var currentDate = new Date();
var day = currentDate.getDate();
var month = currentDate.getMonth() + 1;
var year = currentDate.getFullYear();
var fullDate = (year + "-" + month + "-" + day);

//this will start api call
function getApi(event) {
    //stop page reload
    event.preventDefault();

    //first query for todays weather (specify units)
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city.val() + "&appid=" + apiKey+"&units=imperial";
    fetch(queryUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            //display date and city
            todayCardEl.text(data.name + "  (" + fullDate + ")");
            //asisgn jquery var to append info from retreived data
            var card1Body = $("#card-1 .card-body");

            var tempLine = $("<p>").text("Temperature: " + data.main.temp + " F");
            card1Body.append(tempLine);

            var windLine = $("<p>").text("Wind: "+ data.wind.speed + " mph");
            card1Body.append(windLine);

            var humidityLine = $("<p>").text("Humidity: "+ data.main.humidity + " %");
            card1Body.append(humidityLine);

        });
    
    //retrieve geo coordinates for use in 5-day api call
    var geoUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city.val() + "&limit=1&appid=" + apiKey;
    fetch(geoUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            //store coordinates in array
            var lat_lon = [data[0].lat, data[0].lon];
            //build url with coordinates and specify units
            var fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat_lon[0] + "&lon=" + lat_lon[1] + "&appid="+ apiKey +"&units=imperial";
        fetch(fiveDayUrl)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                //create jquery var to append info
                var card2Body = $("#card-2 .card-body");
                //begin posting info with skipping around data array to mimic 24hr time passed. (doesn't seem to post 00:00 data or current hour) 
                var temp2morrow = $("<p>").text("Tomorrow: " + data.list[6].main.temp + " F");
                card2Body.append(temp2morrow);

                var temp3morrow = $("<p>").text("2 Days from now: " + data.list[13].main.temp + " F");
                card2Body.append(temp3morrow);

                var temp4morrow = $("<p>").text("3 Days from now: " + data.list[21].main.temp + " F");
                card2Body.append(temp4morrow);

                var temp5morrow = $("<p>").text("4 Days from now: " + data.list[29].main.temp + " F");
                card2Body.append(temp5morrow);

                var temp6morrow = $("<p>").text("5 Days from now: " + data.list[37].main.temp + " F");
                card2Body.append(temp6morrow);
            })
         });
    }

fetchButtonEl.on('click', getApi);