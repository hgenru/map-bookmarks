function AppViewModel() {
    this.map = null;
    this.currentLocation = ko.observable(null);

    this.myMarker = getMarker({
        'type': 'Feature',
        'properties': {
            'icon': 'arrow',
            'iconSize': [40, 40]
        },
        'geometry': {
            'type': 'Point',
            'coordinates': [0, 0]
        }
    });
}

AppViewModel.prototype.initMap = function() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaGdlbiIsImEiOiJjaXJxcWtnMjcwMGIxaHhrd2djdzh0NXU0In0.xR92mMgQ2B4I9XwHNoFAHw';
    this.map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
        center: [37.5914271, 55.7372329], // starting position
        zoom: 9, // starting zoom
        attributionControl: false
    });
    this.map.addControl(new mapboxgl.Navigation());
};

AppViewModel.prototype.handlePositionChange = function(pos) {
    var ll = new mapboxgl.LngLat(pos.coords.longitude, pos.coords.latitude);
    this.myMarker.setLngLat(ll);
    if (!this.currentLocation()) {
        this.myMarker.addTo(this.map);
    }
    this.currentLocation(ll);
};

AppViewModel.prototype.handlePositionChangeError = function(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
};

AppViewModel.prototype.initPoistionWatch = function() {
    var options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
        this.handlePositionChange.bind(this),
        this.handlePositionChangeError.bind(this),
        options
    );
    navigator.geolocation.watchPosition(
        this.handlePositionChange.bind(this),
        this.handlePositionChangeError.bind(this),
        options
    );
};

AppViewModel.prototype.flyToCurrentLocation = function() {
    if (this.currentLocation()) {
        this.map.flyTo({center: this.currentLocation()});
    }
};



window.m_site = new AppViewModel();
ko.applyBindings(window.m_site);
window.m_site.initMap();
window.m_site.initPoistionWatch();



var geojson = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'properties': {
                'message': 'Foo',
                'iconSize': [60, 60],
                'icon': 'arrow'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [
                    -66.324462890625,
                    -16.024695711685304
                ]
            }
        },
        {
            'type': 'Feature',
            'properties': {
                'message': 'Bar',
                'iconSize': [50, 50]
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [
                    -61.2158203125,
                    -15.97189158092897
                ]
            }
        },
        {
            'type': 'Feature',
            'properties': {
                'message': 'Baz',
                'iconSize': [40, 40]
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [
                    -63.29223632812499,
                    -18.28151823530889
                ]
            }
        }
    ]
};

function getMarker(feature) {
    var wrap = document.createElement('div');
    var el = document.createElement('div');
    el.className = 'marker marker__' + feature.properties.icon;
    el.style.backgroundImage = 'url(resources/map-icons/' +
        feature.properties.icon + '.png)';
    el.style.width = feature.properties.iconSize[0] + 'px';
    el.style.height = feature.properties.iconSize[1] + 'px';

    wrap.appendChild(el);
    var marker = new mapboxgl.Marker(wrap);
    if (feature.geometry.coordinates) {
        marker.setLngLat(feature.geometry.coordinates);
    }
    return marker;
}

// geojson.features.forEach(function(marker) {
//     // create an img element for the marker
//     var el = getMarkerElement(marker);

//     // add marker to map
//     new mapboxgl.Marker(el)
//         .setLngLat(marker.geometry.coordinates)
//         .addTo(map);
// });

function locaionToPoint(location) {
    return {
        type: 'Point',
        coordinates: [
            location.latitude,
            location.longitude
        ]
    };
}
