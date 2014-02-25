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
            exports: '_'
        },
	'leaflet':{
	    exports: 'L'
	}
    }
});

// Start the map
requirejs(['leaflet',
	   'jquery', 
	   'underscore', 
	   'backbone']

, function(L,$, _, Backbone) {

	var MapView = Backbone.View.extend({
		id: "mapView",
		template: _.template( $('#map-template').html() ),
		map: null,
		render: function(){
			this.$el.html(this.template);
			return this;
		},
		initMap: function(){
			$("#appView").append(mapView.render().el); //Make sure our View el is attached to the document
			this.map = L.map(this.el).setView([47.2622639, -122.5100545], 10);
    		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);
		}
	});
	
	var mapView = new MapView();
    mapView.initMap();
});
