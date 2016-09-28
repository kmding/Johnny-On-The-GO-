// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">


  // Initialize Firebase
  // var config = {
  //   apiKey: "AIzaSyAm5g1m-LfYFn6tCoxvwjYBDjgVN2dTTAo",
  //   authDomain: "bathroom-finder-1474502072189.firebaseapp.com",
  //   databaseURL: "https://bathroom-finder-1474502072189.firebaseio.com",
  //   storageBucket: "bathroom-finder-1474502072189.appspot.com",
  //   messagingSenderId: "549506614342"
  // };
  // firebase.initializeApp(config);
var map;
var upVote = 0;
var dnVote = 0;

function initAutocomplete() {
    initMap();
    // var map = new google.maps.Map(document.getElementById('map'), {
    //   center: {lat: 40.217923, lng: -74.746296},
    //   zoom: 8,
    //   mapTypeId: 'roadmap'
    // });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
    // window.setTimeout(initMap, 2000);
    // initMap();
}

function getCity(options, complete) {

    var geocoder = new google.maps.Geocoder(),
        request;

    if (options.latitude) {

        request = { 'latLng': new google.maps.LatLng(options.latitude, options.longitude) };

    } else {

        request = { 'address': options.address };

    };

    geocoder.geocode(request, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {

            console.log(results);

            //check top-level results
            for (var resultIndex = 0; resultIndex < results.length; resultIndex++) {

                var types = results[resultIndex].types;

                for (var typeIndex = 0; typeIndex < types.length; typeIndex++) {

                    if (types[typeIndex] == 'locality') {

                        complete(results[resultIndex].formatted_address);
                        return;

                    };

                };

            };

            //no result, check addresses
            for (var resultIndex = 0; resultIndex < results.length; resultIndex++) {

                var addresses = results[resultIndex].address_components;

                for (var addressIndex = 0; addressIndex < addresses.length; addressIndex++) {

                    var types = addresses[addressIndex].types;

                    for (var typeIndex = 0; typeIndex < types.length; typeIndex++) {

                        if (types[typeIndex] == 'locality') {

                            complete(addresses[addressIndex].long_name);
                            return;

                        };
                    };
                };
            };
        } else {
            console.log('error: ' + status);
            complete();

        };

    });

};


var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 15
    });
    var infoWindow = new google.maps.InfoWindow({ map: map });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            getCity({ latitude: position.coords.latitude, longitude: position.coords.longitude }, function(city) {
                console.log(city);
                infoWindow.setContent(city);
            });
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}



function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

// to type and display review
$("#addRev").on('click', function() {
    var address = $("#addressinput").val().trim();
    var name = $("#namelinput").val().trim();
    var place = $("#placeinput").val().trim();
    var review = $("#reviewinput").val().trim();


    console.log(address);
    console.log(name);
    console.log(place);
    console.log(review);

    // $("#addressdisplay").html(address);
    // $("#namedisplay").html(name);
    // $("#placedisplay").html(place);
    // $("#reviewdisplay").html(review);
    $("#recentReview").append("<h1>" + address);
    $("#recentReview").append("<h4>" + name);
    $("#recentReview").append("<h4>" + place);
    $("#recentReview").append("<p>" + review);
    return false;
});
// vote count
$("#positivevote").on('click', function() {
    upVote++;
    $("#upVote").html(' ' + upVote);
    console.log("+ve vote: " + upVote);
});
$("#negativevote").on('click', function() {
    dnVote++;
    $("#downVote").html(' ' + dnVote);
    console.log("-ve vote: " + dnVote);
});
