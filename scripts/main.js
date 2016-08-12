function AppViewModel() {
    this.map = null;
    this.currentLocation = ko.observable(null);
    this.welcomeMessageSkipped = ko.observable(localStorage.welcomeMessageSkipped);

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
        zoom: 12, // starting zoom,
        minZoom: 11,
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
        this.map.flyTo({center: this.currentLocation(), zoom: 12});
    }
};

AppViewModel.prototype.skipWelcomeMessage = function() {
    localStorage.welcomeMessageSkipped = true;
    this.welcomeMessageSkipped(true);
};



window.m_site = new AppViewModel();
ko.applyBindings(window.m_site);
window.m_site.initMap();
window.m_site.initPoistionWatch();
setTimeout(function() {
    var element = document.querySelector('.splashscreen');
    element.remove();
}, 7000);



var geojson = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'properties': {
                'message': 'Foo',
                'iconSize': [40, 40],
                'icon': 'radar_ammugun'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [37.614289, 55.743434]
            }
        },
        {
            'type': 'Feature',
            'properties': {
                'message': 'Bar',
                'iconSize': [40, 40],
                'icon': 'radar_dateDrink'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [37.620350, 55.741266]
            }
        },
        {
            'type': 'Feature',
            'properties': {
                'message': 'Baz',
                'iconSize': [40, 40],
                'icon': 'radar_diner'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [37.617365, 55.732852]
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

geojson.features.forEach(function(marker) {
    // add marker to map
    var marker = getMarker(marker);
    marker.addTo(m_site.map);
});

function locaionToPoint(location) {
    return {
        type: 'Point',
        coordinates: [
            location.latitude,
            location.longitude
        ]
    };
}
