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
		el: "#mapView",
		template: _.template( $('#map-template').html(), {}),
		render: function(){
			this.$el.append(this.template);
			return this;
		}	
	});

	var mapView = new MapView();
	mapView.render();
    	console.log("initMap called, el is "+ mapView.el.innerHTML);
    	var map = L.map(mapView.el).setView([47.2622639, -122.5100545], 10);
    	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
	mapView.render();
});
