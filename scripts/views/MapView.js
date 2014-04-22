// Start the map
define(['leaflet',
    'jquery',
    'underscore',
    'backbone',
    'tinycolor',
    'leafletDraw',
    'leafletGeometryUtil',
    'leafletSnap',
    'text!MapViewTemplate.ejs',
    'views/NewRouteView'
], function (L, $, _, Backbone,
             tinycolor, leafletDraw, leafletGeometryUtil, leafletSnap, MapViewTemplate,
             NewRouteView) {

    var MapView = Backbone.View.extend({
        id: "map-container",
        template: _.template(MapViewTemplate, {}),
        map: null,
        centroid: null,
        guideLayers: null,
        visibleLayers: {
            routeLayers: {}
        },

        initialize: function () {
            // Register listeners
            this.model.on('sync', this.handleModelSync, this);
            this.model.on('change:layers', this.toggleLayers, this);
            var transitRoutes = this.model.get('transitRoutes');
            transitRoutes.on('add', this.onRouteAdded, this);
            transitRoutes.on('remove', this.onRouteRemoved, this);
        },

        render: function () {
            this.$el.html(this.template);
            $("#map-container").append(this.el); //Make sure our View el is attached to the document

            var height = $(window).height() - $('#title').height();
            $(this.el).height(height);
        },

        initMap: function () {
            console.log('instantiating mapview');
            this.render();
            //Create map, center on Tacoma
            this.map = L.map(this.el).setView([47.2622639, -122.5100545], 10);
            
            // Add the OSM layer tiles
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);

            this.routeFeatureGroup = L.featureGroup().addTo(this.map);

			//Initialize layers to snap to
			this.guideLayers = new Array();
			
			//Initialize draw controller, and pass it the feature group
            var drawControl = new L.Control.Draw({
            	draw: {
            		polyline: {guideLayers: this.guideLayers},
            		marker: {guideLayers: this.guideLayers}
            	},
                edit : {
                    featureGroup : this.routeFeatureGroup
                }
            });
            //Add draw control to the map
            this.map.addControl(drawControl);
                 		
            var marker = L.marker([47.2622639, -122.5100545]).addTo(this.map);
        	 marker.snapediting = new L.Handler.MarkerSnap(this.map, marker);
        	// marker.snapediting.addGuideLayer(guides);
        	 marker.snapediting.enable();

            var that = this;
            
            
            this.map.on('draw:created', function(e) {
                // Route has been drawn, do any route initialization logic and
                // draw the resulting geoJSON. The resulting geoJSON may be
                // different than the one passed in. For example, bus routes must
                // be snapped to the road
                var type = e.layerType;
                var layer = e.layer;
                
                if(e.layer.toGeoJSON().geometry.type === "LineString") {
                    that.handleRouteDraw(e);
                    for(var i = 0;i < that.guideLayers.length; i++) {
         				layer.snapediting.addGuideLayer(that.guideLayers[i]);
    				}
                }
                else if(type === "marker") {
                	that.handleMarkerDraw(e);   

                }
                else{
                	that.map.addLayer(e.layer);
                	drawnItems.addLayer(e.layer);
                }
                
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

                // Draw the city boundary
                var geoJson = L.geoJson(city.boundary, {
                    style: function () {
                        return {
                            opacity: "0,7",
                            color: '#000000',
                            fillOpacity: 0
                        }
                    }
                });
                geoJson.addTo(this.map);
			}
		},

        toggleTractPopLayer: function (toggle) {
            console.log("toggling pop levels");
            if(toggle) {
                var that = this;
                var censusTracts = this.model.get('city').censusTracts;
                // Add shapes, and style according to the population density
                var geoJson = L.geoJson(censusTracts, {
                    style: function (feature) {
                        // Convert the bin to a hex color value
                        var hexColor =
                            that.calcPopColor(feature.properties.popBin,
                                               censusTracts.properties.numBins);

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

        toggleTractEmpLayer: function (toggle) {
            console.log("toggling employment levels");
            if(toggle) {
                var that = this;
                var censusTracts = this.model.get('city').censusTracts;
                // Add shapes, and style according to the population density
                var geoJson = L.geoJson(censusTracts, {
                    style: function (feature) {
                        // Convert the employment bin in to a hex color value
                        var hexColor =
                            that.calcEmpColor(feature.properties.empBin,
                                            censusTracts.properties.numBins);

                        return {
                            opacity: "0", // No need to emphasize the tract borders
                            fillColor: hexColor,
                            fillOpacity: 0.6
                        };
                    }
                });
                this.visibleLayers.empLevels = geoJson;
                geoJson.addTo(this.map);
            } else {
                if(this.visibleLayers.empLevels !== undefined) {
                    this.map.removeLayer(this.visibleLayers.empLevels);
                    this.visibleLayers.empLevels = undefined;
                }
            }
        },

        toggleTransitNetwork: function(toggle) {
            var routeLayers = this.visibleLayers.routeLayers;
            for(var key in routeLayers) {
                var layer = routeLayers[key];
                if(toggle)
                    this.routeFeatureGroup.addLayer(layer);
                else
                    this.routeFeatureGroup.removeLayer(layer);
            }
        },

        calcPopColor: function(bin, numBins) {
            var amount = Math.floor(bin * 100 / numBins);
            var hex = tinycolor.darken('#92278f', amount).toHexString();
            return hex;
        },

        calcEmpColor: function(bin, numBins) {
            var amount = Math.floor(bin * 100 / numBins);
            var hex = tinycolor.darken('#f7941e', amount).toHexString();
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
                } else if(layer.name === "Employment Levels") {
                    this.toggleTractEmpLayer(layer.toggled);
                } else if(layer.name === "Transit Network")
                    this.toggleTransitNetwork(layer.toggled);
            }
        },

        onRouteAdded: function(route) {
            var geoJSON = route.get('geoJson');

            console.log(geoJSON);

            var color = geoJSON.properties.color;
            console.log("Route has been added, drawing");
            var geoJson = L.geoJson(geoJSON, {
                style: function (feature) {
                    return {
                        color: color,
                        weight: 8
                    };
                }
            });
            this.routeFeatureGroup.addLayer(geoJson);
            this.guideLayers.push(geoJson);
            console.log("!!! pushed: "+ geoJson);
            this.visibleLayers.routeLayers[route.get('id')] = geoJson;
        },

        onRouteRemoved: function(route) {
            var id = route.get('id');
            var layer = this.visibleLayers.routeLayers[id];

            // Remove the route layer, and then remove reference from our list
            // of layers
            this.routeFeatureGroup.removeLayer(layer);
            delete this.visibleLayers.routeLayers[id];
        },

        handleRouteDraw: function(event) {
            new NewRouteView({geoJson: event.layer.toGeoJSON(),
                              routes: this.model.get('transitRoutes')}
            ).render();
        },
        
        handleMarkerDraw: function(event) {
        	var type = event.layerType;
           	var layer = event.layer;
            layer.options.draggable = true;      	
        	layer.snapediting = new L.Handler.MarkerSnap(this.map, layer);
    		for(var i = 0;i < guideLayers.length; i++) {
        		layer.snapediting.addGuideLayer(guideLayers[i]);
    		}
        	layer.snapediting.enable();
        	drawnItems.addLayer(layer);
        }
    });

    return MapView;
});