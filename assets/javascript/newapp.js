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

    // Create a new itinerary
    function createItinerary(data) {

        // Empty table
        // Rows are children of the table
        // $("#itinerary-table  tr").remove();

        // Store everything into a variable.
        var user = data.val().user;
        var location = data.val().location;
        var destination = data.val().destination;
        var startDate = moment(data.val().startDate, "X");
        var endDate = moment(data.val().endDate, "X");
        var numberOfDays = endDate.diff(startDate, "days");
        console.log("Days = " + numberOfDays);

        // Create number of days rows in itinerary tabale
        for (var i = 1; i < numberOfDays; i++) {
            // Create the new row
            var newRow = $("<tr>").append(
                $("<td>").text("Day" + i),
                $("<td>").text(""),
                $("<td>").text(""),
                $("<td>").text(""),
                $("<td>").text("")
            );

            // Append the new row to the table
            $("#itinerary-table > tbody").append(newRow);

            // // Creates local "temporary" object for holding itinerary data
            // var newItineraryDay = {
            //     day: day,
            //     whereAmI: whereAmI,
            //     howTravel: howTravel,
            //     whatToDo: whatToDo,
            //     contact: endDate
            // };

            // // Use push instead of set to create rows
            // itinRef.push(newItineraryDay);

        }
    }


    // Create Firebase event for adding itinerary to the database 
    // and a row in the html when a user adds an entry
    itinRef.on("child_added", function (childSnapshot) {

        console.log("Trip ref on child added");
        console.log(childSnapshot.val());

        // Store everything into a variable.
        var user = childSnapshot.val().user;
        var location = childSnapshot.val().location;
        var destination = childSnapshot.val().destination;
        var startDate = childSnapshot.val().startDate;
        var endDate = childSnapshot.val().endDate;

        // Trip Info
        console.log(user);
        console.log(location);
        console.log(destination);
        console.log(startDate);
        console.log(endDate);

        // Prettify the start/end dates
        var tripStartPretty = moment.unix(startDate).format("MM/DD/YYYY");
        var tripEndPretty = moment.unix(endDate).format("MM/DD/YYYY");

        // Calculate the days until your trip
        var daysToTrip = moment().diff(moment(startDate, "X"), "days");
        console.log("Days to trip = " + daysToTrip);

        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(user),
            $("<td>").text(destination),
            $("<td>").text(tripStartPretty),
            $("<td>").text(tripEndPretty),
            $("<td>").text(""),
            $("<td>").text("")
        );

        // Append the new row to the table
        $("#trip-table > tbody").append(newRow);
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