// AutoComplete
function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 34.554174, lng: 18.042862 },
        zoom: 4,
        mapTypeId: 'roadmap'
    });
    
    

    // search box
    var input = document.getElementById('search-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // finds relevant location on map

    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        console.log(places.length)

        // deletes previous marker after new search
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("invalid location");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(65, 65),
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
                bounds.union(place.geometry.viewport);
            }
            else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

    addMarker({ lat: 26.5320334, lng: 29.8241934 })
    addMarker({ lat: 42.9962815, lng: 12.3607714 })
    addMarker({ lat: 39.4103157, lng: -3.3879712 })
    addMarker({ lat: 34.554174, lng: 18.042862 })
    // Add marker function
    function addMarker(coords) {
        var marker = new google.maps.Marker({
            position: coords,
            map: map,
            icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        });
    }

}



//information window

var infowindow = new google.maps.info - window({
    content: '<h1> (add info here) </h1>'
})

marker.addlistener('click', function() {
    infowindow.open(map, marker);
})
