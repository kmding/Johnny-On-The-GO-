var map;
var upVote = 0;
var downVote = 0;
function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.217923, lng: -74.746296},  
    zoom: 8,
    mapTypeId: 'roadmap'
  });

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
}
$("#addRev").on('click', function (){
  var address= $("#addressinput").val().trim();
  var name= $("#namelinput").val().trim();
  var place= $("#placeinput").val().trim();
  var review= $("#reviewinput").val().trim();

  console.log(address);
  console.log(name);
  console.log(place);
  console.log(review);

  // $("#addressdisplay").html(address);
  // $("#namedisplay").html(name);
  // $("#placedisplay").html(place);
  // $("#reviewdisplay").html(review);
  $("#recentMember").append("<h1>" + address);
  $("#recentMember").append("<h4>" + name);
  $("#recentMember").append("<h4>" + place);
  $("#recentMember").append("<p>" + review);
  return false;
});
var upVoteImage = $('<img>');
    upVoteImage.attr('src', 'assets/images/thumbsup.png');
    upVoteImage.attr('alt', 'crystals');
    upVoteImage.addClass('image');
    $("#uVote").html(upVoteImage);
$(".image").on('click', function(){
  upVote++;
  $("#resultVote").html(upVote);
 console.log(upVote);
})
var downVoteImage = $('<img>');
    downVoteImage.attr('src', 'assets/images/thumbdown.png');
    downVoteImage.attr('alt', 'crystals');
    downVoteImage.addClass('imageTwo');
    $("#dVote").append(downVoteImage);
$(".imageTwo").on('click', function(){
  downVote++;
 console.log(downVote);
})