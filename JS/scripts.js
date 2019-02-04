 let map, places, infoWindow;
 let markers = [];
 let autocomplete;
 let MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
 let hostnameRegexp = new RegExp('^https?://.+?/');
 //  google map //
 function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
   center: { lat: 42.9962815, lng: 12.3607714 },
   zoom: 4,
   mapTypeId: 'roadmap'
  });

  infoWindow = new google.maps.InfoWindow({
   content: document.getElementById('info-content')
  });
  // dropdown box //
  document.getElementById("selectbox").onchange = onPlaceChanged;

  // Create the autocomplete object and associate it with the UI input control.
  // Restrict the search to the default country, and to place type "cities".
  autocomplete = new google.maps.places.Autocomplete(
   /** @type {!HTMLInputElement} */
   (
    document.getElementById('autocomplete')), {
    types: ['(cities)']
   });
  places = new google.maps.places.PlacesService(map);

  autocomplete.addListener('place_changed', onPlaceChanged);

  createMarkers();
 }
 // italy default marker //
 function createMarkers() {
  customMarkers = [
   [{ lat: 42.9962815, lng: 12.3607714 }, 'This is Italy! ']
  ];
  //add custom markers //
  customMarkers.forEach(latLang => {
   let marker = new google.maps.Marker({
    position: latLang[0],
    map: map,
    icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
    test: latLang[1]
   });
   // click function for marker //
   google.maps.event.addListener(marker, 'click', function() {
    alert(marker.test)
    //set map zoom //
    map.setZoom(9);
    search()
    map.setCenter(e.latLng);
   });
  });
 }

 // When the user selects a city, get the place details for the city and
 // zoom the map in on the city.
 function onPlaceChanged() {
  let place = autocomplete.getPlace();
  if (place.geometry) {
   map.panTo(place.geometry.location);
   map.setZoom(15);
   //dropdown menu option values //
   let dropdownsearchType = $('#selectbox option:selected').val();
   console.log(dropdownsearchType);
   //run search function using drop down search type selected by user //
   search(dropdownsearchType);
  }
  else {
   document.getElementById('autocomplete').placeholder = 'Enter a city';
  }
 }

 // Search for hotels in the selected city, within the viewport of the map.
 function search(searchType) {
  let search = {
   bounds: map.getBounds(),
   types: [searchType]
  };

  places.nearbySearch(search, function(results, status) {
   if (status === google.maps.places.PlacesServiceStatus.OK) {
    clearResults();
    clearMarkers();
    // Create a marker for each hotel found, and
    // assign a letter of the alphabetic to each marker icon.
    for (let i = 0; i < results.length; i++) {
     let markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
     let markerIcon = MARKER_PATH + markerLetter + '.png';
     // Use marker animation to drop the icons incrementally on the map.
     markers[i] = new google.maps.Marker({
      position: results[i].geometry.location,
      animation: google.maps.Animation.DROP,
      icon: markerIcon
     });
     // If the user clicks a hotel marker, show the details of that hotel
     // in an info window.
     markers[i].placeResult = results[i];
     google.maps.event.addListener(markers[i], 'click', showInfoWindow, );
     setTimeout(dropMarker(i), i * 100);
     addResult(results[i], i);
    }
   }
  });
 }
 // clear markers off the map //
 function clearMarkers() {
  for (let i = 0; i < markers.length; i++) {
   if (markers[i]) {
    markers[i].setMap(null);
   }
  }
  markers = [];
 }

 // Set the country restriction based on user input.
 // Also center and zoom the map on the given country.
 function setAutocompleteCountry() {
  let country = document.getElementById('country').value;
  if (country == 'all') {
   autocomplete.setComponentRestrictions({ 'country': [] });
   map.setCenter({ lat: 15, lng: 0 });
   map.setZoom(2);
  }
  else {
   autocomplete.setComponentRestrictions({ 'country': country });
   map.setCenter(countries[country].center);
   map.setZoom(countries[country].zoom);
  }
  clearResults();
  clearMarkers();
 }
 //drop marker on relevant country when searched //
 function dropMarker(i) {
  return function() {
   markers[i].setMap(map);
  };
 }
 // show results in container when search function is run, showing all hotels/restaurants and places of interest //
 function addResult(result, i) {
  let results = document.getElementById('results');
  let markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
  let markerIcon = MARKER_PATH + markerLetter + '.png';

  let tr = document.createElement('tr');
  tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
  tr.onclick = function() {
   google.maps.event.trigger(markers[i], 'click');
  };

  let iconTd = document.createElement('td');
  let nameTd = document.createElement('td');
  let icon = document.createElement('img');
  icon.src = markerIcon;
  icon.setAttribute('class', 'placeIcon');
  icon.setAttribute('className', 'placeIcon');
  let name = document.createTextNode(result.name);
  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  results.appendChild(tr);
 }
 // clear search results //
 function clearResults() {
  let results = document.getElementById('results');
  while (results.childNodes[0]) {
   results.removeChild(results.childNodes[0]);
  }
 }

 // Get the place details for a hotel. Show the information in an info window,
 // anchored on the marker for the hotel that the user selected.
 function showInfoWindow() {
  let marker = this;
  places.getDetails({ placeId: marker.placeResult.place_id },
   function(place, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
     return;
    }
    infoWindow.open(map, marker);
    buildIWContent(place);
   });
 }

 // Load the place information into the HTML elements used by the info window.
 function buildIWContent(place) {
  document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
   'src="' + place.icon + '"/>';
  document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
   '">' + place.name + '</a></b>';
  document.getElementById('iw-address').textContent = place.vicinity;

  if (place.formatted_phone_number) {
   document.getElementById('iw-phone-row').style.display = '';
   document.getElementById('iw-phone').textContent =
    place.formatted_phone_number;
  }
  else {
   document.getElementById('iw-phone-row').style.display = 'none';
  }

  // Assign a five-star rating to the hotel, using a black star ('&#10029;')
  // to indicate the rating the hotel has earned, and a white star ('&#10025;')
  // for the rating points not achieved.
  if (place.rating) {
   let ratingHtml = '';
   for (let i = 0; i < 5; i++) {
    if (place.rating < (i + 0.5)) {
     ratingHtml += '&#10025;';
    }
    else {
     ratingHtml += '&#10029;';
    }
    document.getElementById('iw-rating-row').style.display = '';
    document.getElementById('iw-rating').innerHTML = ratingHtml;
   }
  }
  else {
   document.getElementById('iw-rating-row').style.display = 'none';
  }

  // The regexp isolates the first part of the URL (domain plus subdomain)
  // to give a short URL for displaying in the info window.
  if (place.website) {
   let fullUrl = place.website;
   let website = hostnameRegexp.exec(place.website);
   if (website === null) {
    website = 'http://' + place.website + '/';
    fullUrl = website;
   }
   document.getElementById('iw-website-row').style.display = '';
   document.getElementById('iw-website').textContent = website;
  }
  else {
   document.getElementById('iw-website-row').style.display = 'none';
  }
 }
 