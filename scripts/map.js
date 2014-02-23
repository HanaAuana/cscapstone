define(['leaflet', 'underscore', 'backbone'], function(L, _, Backbone) {

	initMap = function() {
		var map = L.map('map').setView([47.2622639, -122.5100545], 10);
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

	}
})

