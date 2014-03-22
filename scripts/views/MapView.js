
// Start the map
define(['jquery', 
		'underscore', 
		'leaflet',
		'https://api.tiles.mapbox.com/mapbox.js/v1.6.2/mapbox.js',
	   'backbone'
], function(L,$, _, Backbone) {

	var MapView = Backbone.View.extend({
		id: "mapView",
		map: null,
        centroid: null,

        initialize: function() {
            var model = this.model;
            if(model !== undefined) {
                model.on('sync', this.handleModelSync, this);
            }
        },

		render: function(){
			this.$el.html('<div id = "mapView"></div>');
			return this;
		},

		initMap: function(){
            console.log('instantiating mapview');
			$("#title").append(this.render().el); //Make sure our View el is attached to the document
			this.map = L.map(this.el).setView([47.2622639, -122.5100545], 10);
    		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);
		},

        handleModelSync: function() {
            var city = this.model.get('city');
            var newCentroid = city.centroid;
            // Only pan if the centroid has changed
            if(this.centroid == null || this.centroid != newCentroid) {
                console.log('panning to ' + newCentroid);
                this.map.panTo(L.latLng(newCentroid[0], newCentroid[1]));

                this.centroid = newCentroid;
            }

            this.enableTractPopLayer();
        },

        enableTractPopLayer: function() {
            var censusTracts = this.model.get('city').censusTracts;
            var maxDensity = censusTracts.properties.maxPopulation;
            // Add shapes, and style according to the population density
            L.geoJson(censusTracts, {
                style: function(feature) {
                    // Convert the population density in to a hex color value
                    var pct = feature.properties.population / maxDensity;
                    var blueShade = 255 - Math.floor(pct * 255);
                    var hexColor = "#0000" + blueShade.toString(16);

                    return {
                        color: hexColor,
                        fillColor: hexColor,
                        fillOpacity: 0.8
                    };
                }
            }).addTo(this.map);

        }
	});
	
    return MapView;
});
