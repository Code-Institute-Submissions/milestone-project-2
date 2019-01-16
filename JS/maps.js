var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 34.554174, lng: 18.042862 },
        zoom: 4
    });
}