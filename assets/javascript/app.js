// Homework #8
// Team #4
// 4/24/2019
// Project #1 - Pack  Your Bags
// 
// Key new functionality:
// 
// ToDo
// Error checking for fields entered
//   Start date before end date
//   Valid destination
//   No duplicate entries

$(document).ready(function () {

    // define global variables
    var tripRef = null;
    var userRef = null;

    // Initialize Firebase - trips and users
    var config = {
        apiKey: "AIzaSyD0BDJV4C0DdyFTzmh2325woYax-e1GrVI",
        authDomain: "pvraab-hw8trial.firebaseapp.com",
        databaseURL: "https://pvraab-hw8trial.firebaseio.com",
        projectId: "pvraab-hw8trial",
        storageBucket: "pvraab-hw8trial.appspot.com",
        messagingSenderId: "895268552157"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    // Set references to trip and user database children
    tripRef = database.ref("/trip");
    userRef = database.ref("/user");

    // Event handler for button click to add a user
    $("#add-user-btn").on("click", function (event) {

        // Prevent default form action
        event.preventDefault();

        // Grabs user input from form
        var user = $("#user-input").val().trim();
        var location = $("#location-input").val().trim();
        var email = $("#email-input").val().trim();
        var phone = $("#phone-input").val().trim();
        var emergencyContact = $("#emergency-contact-input").val().trim();

        // Creates local "temporary" object for holding user data
        var newUser = {
            user: user,
            location: location,
            email: email,
            phone: phone,
            emergencyContact: emergencyContact
        };

        // Uploads user data to the database
        userRef.push(newUser);

        // Logs everything to console
        console.log(newUser.user);
        console.log(newUser.location);
        console.log(newUser.email);
        console.log(newUser.phone);
        console.log(newUser.emergencyContact);

        alert("User successfully added");

        // Clears all of the text-boxes
        $("#user-input").val("");
        $("#location-input").val("");
        $("#email-input").val("");
        $("#phone-input").val("");
        $("#emergency-contact-input").val("");
    });

    // Create Firebase event for adding user to the database 
    // and a row in the html when a user adds an entry
    userRef.on("child_added", function (childSnapshot) {
        console.log("User ref on child added");
        console.log(childSnapshot.val());

        // Store everything into a variable.
        var user = childSnapshot.val().user;
        var location = childSnapshot.val().location;
        var email = childSnapshot.val().email;
        var phone = childSnapshot.val().phone;
        var emergencyContact = childSnapshot.val().emergencyContact;

        // Trip Info
        console.log(user);
        console.log(location);
        console.log(email);
        console.log(phone);
        console.log(emergencyContact);

        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(user),
            $("<td>").text(location),
            $("<td>").text(email),
            $("<td>").text(phone),
            $("<td>").text(emergencyContact)
        );

        // Append the new row to the table
        $("#user-table > tbody").append(newRow);
    });

    // Event handler for button click to add a trip
    $("#add-trip-btn").on("click", function (event) {

        // Prevent default form action
        event.preventDefault();

        // Grabs user input
        var name = $("#name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var startDate = moment($("#start-input").val().trim(), "MM/DD/YYYY").format("X");
        var endDate = moment($("#end-input").val().trim(), "MM/DD/YYYY").format("X");

        // Creates local "temporary" object for holding trip data
        var newTrip = {
            name: name,
            destination: destination,
            startDate: startDate,
            endDate: endDate
        };

        // Uploads trip data to the database
        // database.ref().push(newTrip);
        tripRef.push(newTrip);

        // Logs everything to console
        console.log(newTrip.name);
        console.log(newTrip.destination);
        console.log(newTrip.startDate);
        console.log(newTrip.endDate);

        alert("Trip successfully added");

        // Clears all of the text-boxes
        $("#name-input").val("");
        $("#destination-input").val("");
        $("#start-input").val("");
        $("#end-input").val("");
    });

    // Create Firebase event for adding trip to the database 
    // and a row in the html when a user adds an entry
    tripRef.on("child_added", function (childSnapshot) {

        console.log("Trip ref on child added");
        console.log(childSnapshot.val());

        // Store everything into a variable.
        var name = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var startDate = childSnapshot.val().startDate;
        var endDate = childSnapshot.val().endDate;

        // Trip Info
        console.log(name);
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
            $("<td>").text(name),
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