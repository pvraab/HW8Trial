// Homework #8
// Team #4
// 4/24/2019
// Project #1 - Pack  Your Bags
// 
// Key new functionality:
// 
// ToDo
// Consider confirming user and itinerary updates/deletes
// Error checking for fields entered
//   Start date before end date
//   Maybe set a limit on number of days we can handle
//   Valid location and destination
// Scroll table
// Click on a row and populate itinerary day form
// Get a row by Day key
// How do we empty DB child
// Create a PDF or other document of itinerary
// Wait for document to finish loading
$(document).ready(function () {

    // Define global variables
    var userRef = null;
    var itinRef = null;

    // Initialize Firebase - user aand itinerary
    var config = {
        apiKey: "AIzaSyDrMiR3_zjAuyVfWTilJ6Xu9ZMpelhzLd8",
        authDomain: "pvraab-packbags.firebaseapp.com",
        databaseURL: "https://pvraab-packbags.firebaseio.com",
        projectId: "pvraab-packbags",
        storageBucket: "pvraab-packbags.appspot.com",
        messagingSenderId: "414747253725"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    // Set references to user and itinerary database children
    userRef = database.ref("/user");
    itinRef = database.ref("/itinerary");

    // Add or update user on #add-user-btn button click
    $("#add-user-btn").on("click", function (event) {

        // Prevent default form action
        event.preventDefault();

        // Grabs user input from form
        var user = $("#user-input").val().trim();
        var location = $("#location-input").val().trim();
        var destination = $("#destination-input").val().trim();

        // Convert dates to unix seconds
        var startDate = moment($("#start-input").val().trim(), "MM/DD/YYYY").format("X");
        var endDate = moment($("#end-input").val().trim(), "MM/DD/YYYY").format("X");

        // Creates local "temporary" object for holding user data
        var newUser = {
            user: user,
            location: location,
            destination: destination,
            startDate: startDate,
            endDate: endDate
        };

        // Use set instead of push so there is only one
        userRef.set(newUser);

        // Logs everything to console
        console.log(newUser);

    });

    // Create Firebase event for adding user to the database 
    // and a row in the html when a user adds an entry
    userRef.on("value", function (snapshot) {
        console.log("User ref on child added");
        console.log(snapshot.val());

        // Store everything into a variable.
        var user = snapshot.val().user;
        var location = snapshot.val().location;
        var destination = snapshot.val().destination;
        var startDate = moment(snapshot.val().startDate, "X").format("MM/DD/YYYY");
        var endDate = moment(snapshot.val().endDate, "X").format("MM/DD/YYYY");

        // Update screen
        $("#user-input").val(user);
        console.log("Store " + user);
        $("#location-input").val(location);
        console.log("Store " + location);
        $("#destination-input").val(destination);
        console.log("Store " + destination);
        $("#start-input").val(startDate);
        console.log("Store " + startDate);
        $("#end-input").val(endDate);
        console.log("Store " + endDate);

    });

    // Add itinerary on #add-user-btn button click
    $("#add-itinerary-btn").on("click", function (event) {

        // Prevent default form action
        event.preventDefault();

        // Get the user reference
        var ref = database.ref("user");
        ref.on("value", createItinerary);

    });

    // Create a new itinerary
    function createItinerary(data) {

        // Empty table
        // https://stackoverflow.com/questions/370013/jquery-delete-all-table-rows-except-first
        $("#itinerary-table").find("tr:gt(0)").remove();

        // Empty database itinerary
        var ref = database.ref("itinerary");
        ref.set(null);

        // Store everything into a variable.
        var user = data.val().user;
        var location = data.val().location;
        var destination = data.val().destination;
        var startDate = moment(data.val().startDate, "X");
        var endDate = moment(data.val().endDate, "X");
        var numberOfDays = endDate.diff(startDate, "days") + 1;
        console.log("Days = " + numberOfDays);
        var thisDate = startDate;
        console.log(thisDate);

        // Create number of days rows in itinerary and store in databasae
        for (var i = 1; i <= numberOfDays; i++) {

            // Create data
            var day = "Day" + i;
            var whereAmI = "SomeWhere" + i;
            var howTravel = "PlanetrainBus" + i;
            var whatToDo = "Something" + i;
            var contact = "Contact" + i;
            var newDate = thisDate.format("X");

            // Creates local "temporary" object for holding itinerary data
            var newItineraryDay = {
                day: day,
                thisDate: newDate,
                whereAmI: whereAmI,
                howTravel: howTravel,
                whatToDo: whatToDo,
                contact: contact
            };

            // Use push instead of set to create rows
            itinRef.push(newItineraryDay);

            thisDate = thisDate.add(parseInt(1), "day");


        }
    }

    // Create Firebase event for adding itinerary to the database 
    // and a row in the html when a user adds an entry
    itinRef.on("child_added", function (childSnapshot) {

        console.log("Trip ref on child added");
        console.log(childSnapshot.val());

        // Store everything into a variable.
        var day = childSnapshot.val().day;
        var thisDate = childSnapshot.val().thisDate;
        var newDate = moment(thisDate, "X").format("MM/DD/YYYY");
        var whereAmI = childSnapshot.val().whereAmI;
        var howTravel = childSnapshot.val().howTravel;
        var whatToDo = childSnapshot.val().whatToDo;
        var contact = childSnapshot.val().contact;

        // Prettify the start/end dates
        // var tripStartPretty = moment.unix(thisDate).format("MM/DD/YYYY");

        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(day),
            $("<td>").text(newDate),
            $("<td>").text(whereAmI),
            $("<td>").text(howTravel),
            $("<td>").text(whatToDo),
            $("<td>").text(contact)
        );

        // Put day key on row
        newRow.attr("data-index", day);

        // Append the new row to the table
        $("#itinerary-table > tbody").append(newRow);
    });

    // Handle clicks on itinerary 
    $("#itinerary-table").on("click", function() {
        console.log("Click on table");
        console.log($(this));
        var index = $(this).attr("data-index");
        console.log("Row number = " + index);
    });

    // Flights button click handler
    $('#getFlights').on("click", function () {

        // Constructing a URL to search flights
        queryURL = "https://api.skypicker.com/flights?flyFrom=DEN&to=LGW&dateFrom=01/05/2019&dateTo=03/05/2019&partner=picky";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            // // Successful query
            // appData.isQueryOn = true;

            // Store the response
            // appData.gifData.push(response);

            // Storing an array of results in the results variable
            var results = response.data;
            console.log(response);


            var jsonString = JSON.stringify(results);
            var jsonPretty = JSON.stringify(JSON.parse(jsonString), null, 2);
            console.log(jsonPretty);
            var preElem = $("<pre>");
            preElem.html(jsonPretty);
            $("#modalText").html(preElem);
            $("#moreInfoModalTitle").text("Flights");
        });
    });

    // Weather button click handler
    $('#getWeather').on("click", function () {

        // This is our API key
        var APIKey = "166a433c57516f51dfab1f7edaed8413";

        // Here we are building the URL we need to query the database
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
            "q=Denver, CO, USA&units=imperial&appid=" + APIKey;

        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            // We store all of the retrieved data inside of an object called "response"
            .then(function (response) {

                // Log the queryURL
                console.log(queryURL);

                // Log the resulting object
                console.log(response);

                // // Transfer content to HTML
                // $(".city").html("<h1>" + response.name + " Weather Details</h1>");
                // $(".wind").text("Wind Speed: " + response.wind.speed);
                // $(".humidity").text("Humidity: " + response.main.humidity);
                // $(".temp").text("Temperature (F) " + response.main.temp);

                // // Log the data in the console as well
                // console.log("Wind Speed: " + response.wind.speed);
                // console.log("Humidity: " + response.main.humidity);
                // console.log("Temperature (F): " + response.main.temp);

                var jsonString = JSON.stringify(response);
                var jsonPretty = JSON.stringify(JSON.parse(jsonString), null, 2);
                console.log(jsonPretty);
                var preElem = $("<pre>");
                preElem.html(jsonPretty);
                $("#modalText").html(preElem);
                $("#moreInfoModalTitle").text("Weather");
            });
    });

    // Currency exchange button click handler
    // https://fixer.io/quickstart
    $('#getCurrencyExchange').on("click", function () {

        // This is our API key
        var APIKey = "2363396842cbd6f647b46f205c08efff";

        // Here we are building the URL we need to query the database
        var queryURL = "http://data.fixer.io/api/latest?access_key=2363396842cbd6f647b46f205c08efff&symbols=USD,AUD,CAD,PLN,MXN&format=1";

        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            // We store all of the retrieved data inside of an object called "response"
            .then(function (response) {

                // Log the queryURL
                console.log(queryURL);

                // Log the resulting object
                console.log(response);

                var jsonString = JSON.stringify(response);
                var jsonPretty = JSON.stringify(JSON.parse(jsonString), null, 2);
                console.log(jsonPretty);
                var preElem = $("<pre>");
                preElem.html(jsonPretty);
                $("#modalText").html(preElem);
                $("#moreInfoModalTitle").text("Currency Exchange");
            });
    });

    // Yelp button click handler
    // https://fixer.io/quickstart
    $('#getYelp').on("click", function () {

        // This is our API key
        var APIKey = "2363396842cbd6f647b46f205c08efff";

        // Here we are building the URL we need to query the database
        var queryURL = "http://data.fixer.io/api/latest?access_key=2363396842cbd6f647b46f205c08efff&symbols=USD,AUD,CAD,PLN,MXN&format=1";

        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            // We store all of the retrieved data inside of an object called "response"
            .then(function (response) {

                // Log the queryURL
                console.log(queryURL);

                // Log the resulting object
                console.log(response);

                var jsonString = JSON.stringify(response);
                var jsonPretty = JSON.stringify(JSON.parse(jsonString), null, 2);
                console.log(jsonPretty);
                var preElem = $("<pre>");
                preElem.html(jsonPretty);
                $("#modalText").html(preElem);
                $("#moreInfoModalTitle").text("Yelp");
            });
    });

    // Country info click handler
    $('#getCountryInfo').on("click", function () {

        // Here we are building the URL we need to query the database
        var queryURL = "https://www.state.gov/api/v1/?command=get_country_fact_sheets&fields=title,terms,full_html&terms=italy:any,yemen:any";

        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            // We store all of the retrieved data inside of an object called "response"
            .then(function (response) {

                $("#modalText").html(response.country_fact_sheets[0].full_html);
                $("#moreInfoModalTitle").text("Country Info");

            });
    });

    // Travel advisory click handler
    $('#getTravelAdvisory').on("click", function () {

        console.log("TA")

        // Here we are building the URL we need to query the database
        var queryURL = "https://travel.state.gov/_res/rss/TAsTWs.xml";

        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            // We store all of the retrieved data inside of an object called "response"
            .then(function (response) {

                // Log the queryURL
                console.log(queryURL);

                // Log the resulting object
                console.log(response);

                $("#modalText").html(response);
                $("#moreInfoModalTitle").text("Travel Advisory");
            });
    });

});