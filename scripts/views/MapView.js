// Start the map
define(['leaflet',
    'jquery',
    'underscore',
    'backbone',
    'tinycolor',
    'leafletDraw',
    'text!MapViewTemplate.ejs'
], function (L, $, _, Backbone, tinycolor, leafletDraw, MapViewTemplate) {

    var MapView = Backbone.View.extend({
        id: "map-container",
        template: _.template(MapViewTemplate, {}),
        map: null,
        centroid: null,
        visibleLayers: {},


        initialize: function () {
             // Register listeners
            this.model.on('sync', this.handleModelSync, this);
            this.model.on('change:layers', this.toggleLayers, this);

        },

        render: function () {
            this.$el.html(this.template);
            $("#map-container").append(this.el); //Make sure our View el is attached to the document
        },

        initMap: function () {
            console.log('instantiating mapview');
            this.render();
            this.map = L.map(this.el).setView([47.2622639, -122.5100545], 10);
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);

            var featureGroup = L.featureGroup().addTo(this.map);

            var drawControl = new L.Control.Draw({
                edit : {
                    featureGroup : featureGroup
                }
            }).addTo(this.map);

            this.map.on('draw:created', function(e) {
                featureGroup.addLayer(e.layer);
            });
        },

        handleModelSync: function () {
            var city = this.model.get('city');
            var newCentroid = city.centroid;
            // Only pan if the centroid has changed
            if (this.centroid == null || this.centroid != newCentroid) {
                console.log('panning to ' + newCentroid);
                this.map.panTo(L.latLng(newCentroid[0], newCentroid[1]));


				this.centroid = newCentroid;
			}
		},

        toggleTractPopLayer: function (toggle) {
            console.log("toggling pop levels");
            if(toggle) {
                var that = this;
                var censusTracts = this.model.get('city').censusTracts;
                var maxDensity = censusTracts.properties.maxPopDensity;
                // Add shapes, and style according to the population density
                var geoJson = L.geoJson(censusTracts, {
                    style: function (feature) {
                        // Convert the population density in to a hex color value
                        var pct = feature.properties.populationDensity / maxDensity;
                        var hexColor = that.calcPopColor(pct);

                        return {
                            opacity: "0", // No need to emphasize the tract borders
                            fillColor: hexColor,
                            fillOpacity: 0.6
                        };
                    }
                });
                this.visibleLayers.popLevels = geoJson;
                geoJson.addTo(this.map);
            } else {
                if(this.visibleLayers.popLevels !== undefined) {
                    this.map.removeLayer(this.visibleLayers.popLevels);
                    this.visibleLayers.popLevels = undefined;
                }
            }

        },

        calcPopColor: function(pct) {
            var amount = Math.floor(pct * 100);
            var hex = tinycolor.darken("yellow", amount).toHexString();
            return hex;
        },

        // Invoked anytime the user changes which layers are viewable
        toggleLayers: function(changedLayers) {
            for(var key in changedLayers) {
                if(!changedLayers.hasOwnProperty(key))
                    continue;

                var layer = changedLayers[key];
                if(layer.name === "Population Levels") {
                    this.toggleTractPopLayer(layer.toggled);
                }
                // TODO other layers
            }
        }
    });

    return MapView;
});
