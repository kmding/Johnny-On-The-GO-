// Initialize Firebase
// var config = {
//   apiKey: "AIzaSyAm5g1m-LfYFn6tCoxvwjYBDjgVN2dTTAo",
//   authDomain: "bathroom-finder-1474502072189.firebaseapp.com",
//   databaseURL: "https://bathroom-finder-1474502072189.firebaseio.com",
//   storageBucket: "bathroom-finder-1474502072189.appspot.com",
//   messagingSenderId: "549506614342"
// };
// firebase.initializeApp(config);
// var database = firebase.database();
var map;
var upVote = 0;
var dnVote = 0;

function initAutocomplete() {
    initMap();
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
        // markers.forEach(function(marker) {
        //   marker.setMap(null);
        // });
        // markers = [];
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
        zoom: 12
    });
    var infoWindow = new google.maps.InfoWindow({ map: map });
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            infowindow = new google.maps.InfoWindow();
            service = new google.maps.places.PlacesService(map);
            console.log(service.nearbySearch)
                // service.nearbySearch(request, callback);
            service.nearbySearch({
                location: pos,
                radius: 5000,
                type: ['store'],
            }, callback);

            function callback(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        var place = results[i];
                        createMarker(results[i]);
                    }
                }
            }

            function createMarker(place) {
                var placeLoc = place.geometry.location;
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.setContent("great");
                    infowindow.open(map, this);
                    // infowindow.nameMarker();
                });
            }
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
    // e.preventDefault();
    var name = $("#namelinput").val().trim();
    var address = $("#autocomplete").val().trim();
    // var hours = $("#hoursdisplay").val().trim();
    var place = $("#placeinput").val().trim();
    var review = $("#reviewinput").val().trim();

    console.log(name);
    // console.log(hours);
    console.log(place);
    console.log(review);
    console.log(address);

    // $("#addressdisplay").html(address);
    // $("#namedisplay").html(name);
    // $("#placedisplay").html(place);
    // $("#reviewdisplay").html(review);
    $("#namedisplay").append(name);
    $("#ratingdisplay").append("Rating: " + rating + " Stars");;
    $("#addressdisplay").append(address);
    $("#hoursdisplay").append(hours);
    $("#placedisplay").append(place);
    $("#reviewdisplay").append(review);

    // create an object to hold the data
    var addedReview = {
            Name: name,
            Address: address,
            Place: place,
            Review: review,
            Rating: rating
        }
    // upload data to the database
    database.ref().push(newTrain);
    // clear input boxes
    $("#namelinput").val(" ")
    $("#autocomplete").val(" ")
    // $("#hoursdisplay").val(" ");
    $("#placeinput").val(" ");
    $("#reviewinput").val(" ");
    // show the data instead of directly moving to the another map
    return false;
});
// database.ref().on("child_added", function(childSnapshot, prevChildKey){

//   console.log(childSnapshot.val());

//   // Store everything into a variable.
//   var name = childSnapshot.val().Name;
//   var address = childSnapshot.val().Address;
//   var place = childSnapshot.val().Place;
//   var review = childSnapshot.val().Review;
//   var rating = childSnapshot.val().Rating;

//   // Employee Info
//   console.log(name);
//   console.log(address);
//   console.log(place);
//   console.log(review);
//   console.log(rating);

//   $("#namedisplay").html(name);
//   $("#ratingdisplay").html("Rating: " + rating + " Stars");;
//   $("#addressdisplay").html(address);
//   $("#hoursdisplay").html(hours);
//   $("#placedisplay").html(place);
//   $("#reviewdisplay").html(review);
// });
// add a stars rating
(function(ratingStars) {
    $.fn.rating = function(method, options) {
        method = method || 'create';
        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            limit: 5,
            value: 0,
            glyph: "glyphicon-star",
            coloroff: "gray",
            coloron: "gold",
            size: "2.0em",
            cursor: "pointer",
            onClick: function() {},
            endofarray: "idontmatter"
        }, options);
        var style = "";
        // set a size,color,cursor style using above data "size","coloroff","cursor"
        style = style + "font-size:" + settings.size + "; ";
        style = style + "color:" + settings.coloroff + "; ";
        style = style + "cursor:" + settings.cursor + "; ";
        if (method == 'create') {
            //this.html('');  //junk whatever was there
            //initialize the data-rating property
            this.each(function() {
                    attr = $(this).attr('data-rating');
                    if (attr === undefined || attr === false) { $(this).attr('data-rating', settings.value); }
                })
                //bolt in the glyphs
            for (var i = 0; i < settings.limit; i++) {
                this.append('<span data-value="' + (i + 1) + '" class="ratingicon glyphicon ' + settings.glyph + '" style="' + style + '" aria-hidden="true"></span>');
            }
            //paint
            this.each(function() { paint($(this)); });
        }
        if (method == 'set') {
            this.attr('data-rating', options);
            this.each(function() { paint($(this)); });
        }
        if (method == 'get') {
            return this.attr('data-rating');
        }
        //register the click events
        this.find("span.ratingicon").click(function() {
            rating = $(this).attr('data-value')
            $(this).parent().attr('data-rating', rating);
            paint($(this).parent());
            settings.onClick.call($(this).parent());
        })

        function paint(div) {
            rating = parseInt(div.attr('data-rating'));
            div.find("input").val(rating); //if there is an input in the div lets set it's value
            div.find("span.ratingicon").each(function() { //now paint the stars

                var rating = parseInt($(this).parent().attr('data-rating'));
                var value = parseInt($(this).attr('data-value'));
                if (value > rating) { $(this).css('color', settings.coloroff); } else { $(this).css('color', settings.coloron); }
            })
        }

    };
}(jQuery));

$(document).ready(function() {

    $("#stars-default").rating();
});