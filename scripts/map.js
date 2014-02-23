requirejs.config({

    baseUrl: "../",

    paths: {
        underscore: 'scripts/lib/underscore',
        backbone: 'scripts/lib/backbone',
        jquery: 'scripts/lib/jquery',
	leaflet: 'scripts/leaflet/leaflet'
    },

    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: ''
        },
	'leaflet':{
	    exports: 'L'
	}
    }
});

// Start the map
requirejs(['leaflet', 
	   'underscore', 
	   'backbone']

, function(L, _, Backbone) {
    console.log("initMap called");
    var map = L.map('map').setView([47.2622639, -122.5100545], 10);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
});
