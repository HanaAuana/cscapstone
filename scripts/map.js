define(['leaflet/leaflet'], function(leaflet) {
    function initmap() {
		var map = leaflet.map('map').setView([47.2622639,-122.5100545], 10);
		
		leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
	}
	initmap();
})


