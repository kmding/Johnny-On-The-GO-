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
try{
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
            var map_marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            });
            
            //create custom properties for map_marker
            map_marker.JOTG_id = place.place_id;
           
      if(typeof(Storage) !== "undefined") {
           localStorage.setItem("JOTG_address") = place.formatted_address;
           localStorage.setItem("JOTG_id") = map_marker.JOTG_id;
        }
     else {
    alert("Sorry, your browser does not support Web Storage...\n Please copy the following address and paste in the input field \n Address: " + place.formatted_address);
      }
            
          var infowindow = new google.maps.InfoWindow();
  google.maps.event.addListener(map_marker, 'click', function() {
            infowindow.setContent(map_marker.getTitle().toString());
            infowindow.open(map, map_marker);

            var location = map_marker.getPosition();
              get_data(map_marker.JOTG_id);
    map.setCenter(this.getPosition());
  });
            markers.push(map_marker);

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
    catch(err){
      alert(err.message);
      }
}


// function firebase_helper(method, data){
//    var config = {
//      apiKey: "AIzaSyAm5g1m-LfYFn6tCoxvwjYBDjgVN2dTTAo",
//      authDomain: "bathroom-finder-1474502072189.firebaseapp.com",
//      databaseURL: "https://bathroom-finder-1474502072189.firebaseio.com/",
//      storageBucket: "bathroom-finder-1474502072189.appspot.com",
//      messagingSenderId: "549506614342"
//    };
//    firebase.initializeApp(config);  
//     var fireRef = new Firebase("https://bathroom-finder-1474502072189.firebaseio.com/");
//    if(method === "POST"){
//   fireRef.set( {data.id : {address : data.address, reviews : data.reviews, placeType: data.placeType, name: data.name}});
//   alert("Data saved!");
//   }
//   if(method === "GET"){
//   	fireRef.child(data.id).on("value", function(snapshot) {
//   		var data = snapshot.val();
// 		var reviews = data.reviews;
// 		var address = data.address;
// 		var typeofplace = data.placeType;
// 		var name = data.name;
// 		process_reviews(reviews, address, typeofplace, name);
// 	});
//   }
// }

function rev_butt(){
   var s = "<button type=\"button\" onclick=\"function(){var rev = document.getElementById(\"review_db\");  elem.style.display = \"none\";}\"> <img src=\"assets/images/remove.png\"/></button>";
   return s;
   }

function process_reviews(a,b,c,d){
   var content = "<span class =\"p-hdr-3\">Name: " + d + "<span><br>" + "<span class =\"p-hdr-3\">Address: " + b + "<span><br>" +  "<span class =\"p-hdr-3\">Type of place: " + c + "<span><br>" + "<span class =\"p-hdr-3\">Reviews: " + a + " stars<span><br>";
        var elem = document.getElementById("review_db");
     elem.innerHTML = rev_butt() + content;
     }

function get_data(curr_id){
    firebase_helper("GET", {id: curr_id});
    }


function submit_data(){
 var id;
  if(typeof(Storage) !== "undefined") {
    id = localStorage.getItem("JOTG_id");
}
     else {
    alert("Sorry, your browser does not support Web Storage...\n Please copy the following address and paste ");
    return;
}
  var data = { id : {address : document.getElementById("addressinput").value.trim(), reviews : document.getElementById("JOTG").value.trim(), placeType: document.getElementById("placeinput").value.trim(), name : document.getElementById("nameinput").value.trim()}
};
    firebase_helper("POST", data);
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

// var markers = [];
//     // Listen for the event fired when the user selects a prediction and retrieve
//     // more details for that place.
//     searchBox.addListener('places_changed', function() {
//         var places = searchBox.getPlaces();

//         if (places.length == 0) {
//             return;
//         }

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

/*// to type and display review
$("#addRev").on('click', function() {
    marker = $("#addressinput").val().trim();
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
*/



/*
 * use google maps api built-in mechanism to attach dom events
 */
 
  // Initialize Firebase

var map;
  /*
   * create map
   */
  var map = new google.maps.Map(document.getElementById("map_div"), {
    center: new google.maps.LatLng(33.808678, -117.918921),
    zoom: 14
  });

  /*
   * create infowindow (which will be used by markers)
   */
  var infoWindow = new google.maps.InfoWindow();

  /*
   * marker creater function (acts as a closure for html parameter)
   */
  function createMarker(options, html) {
    var marker = new google.maps.Marker(options);
    if (html) {
      google.maps.event.addListener(marker, "click", function () {
        infoWindow.setContent(html);
        infoWindow.open(options.map, this);
      });
    }
    return marker;
  }

  /*
   * add markers to map
   */
  // on('click', '.selector', function(addMarker) {
    //   event.preventDefault();
       /* Act on the event */
   //});
    function addMarker(lat, lng, markerTitle, markerMessage, iconImage){
    createMarker({
      position: new google.maps.LatLng(lat, lng),
      map: map,
      icon: iconImage
    }, "<h1>"+markerTitle+"</h1><p>"+markerMessage+"</p>"); 
  }

  addMarker(
    33.808678,
    -117.918921,
    "This is a title.",
    "<button class='reviewBtn'>Get Reviews</button>",
    "http://1.bp.blogspot.com/_GZzKwf6g1o8/S6xwK6CSghI/AAAAAAAAA98/_iA3r4Ehclk/s1600/marker-green.png"
  );
/*$(document).on('click', '.reviewBtn', function(){
  alert('click!');
});*/
//for(elem in document.getElementsByClassName("reviewBtn")){
 // alert(elem);
 // elem.addEventListener("click", function(){alert("clicked");});
//}
