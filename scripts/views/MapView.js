
// Start the map
define(['leaflet',
	   'jquery', 
	   'underscore', 
	   'backbone'
], function(L,$, _, Backbone) {

	var MapView = Backbone.View.extend({
		id: "mapView",
		template: _.template( $('#map-template').html() ),
		map: null,
        centroid: null,

        initialize: function() {
            var model = this.model;
            if(model !== undefined) {
                model.on('sync', this.handleModelSync, this);
            }
        },

		render: function(){
			this.$el.html(this.template);
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

        }
	});
	
    return MapView;
});
