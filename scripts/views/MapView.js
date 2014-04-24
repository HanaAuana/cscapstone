// Start the map
define(['leaflet',
    'underscore',
    'backbone',
    'tinycolor',
    'leafletDraw',
    'leafletGeometryUtil',
    'leafletSnap',
    'text!MapViewTemplate.ejs',
    'views/NewRouteView'
], function (L,
             _,
             Backbone,
             tinycolor,
             leafletDraw,
             leafletGeometryUtil,
             leafletSnap,
             MapViewTemplate,
             NewRouteView)
{
    var MapView = Backbone.View.extend({
        id: "map-container",
        template: _.template(MapViewTemplate, {}),
        map: null,
        centroid: null,
        guideLayers: null,
        lastSnap: null,
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

            var that = this;
            $( window ).resize(function() {
                that.onResize();
            });
        },

        render: function () {
            this.$el.html(this.template);
            $("#map-container").append(this.el); //Make sure our View el is attached to the document

            this.onResize();
        },

        initMap: function () {

            this.render();
            // Create map, center near the centroid of the contiguous US
            this.map = L.map(this.el, {drawControl: true});
            this.map.setView([39.809734, -98.555620],  4);

            // Add the OSM layer tiles
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);

            this.routeFeatureGroup = L.featureGroup().addTo(this.map);
			//Initialize layers to snap to
            this.guideLayers = new Array();
            this.polyLines = new Array();
            this.geoJSONs = new Array();

//            this.map.addControl(new L.Control.Draw({
//                polyline: { guideLayers: this.guideLayers },
//                polygon: { guideLayers: this.guideLayers, snapDistance: 5 },
//                marker: { guideLayers: this.guideLayers, snapVertices: false },
//                draw : {
//                    rectangle: false,
//                    circle: false,
//                    polygon: false
//                }
//            }));

            //Initialize draw controller, and pass it the feature group
            this.map.drawControl.setDrawingOptions({
                polyline: { guideLayers: this.guideLayers },
                polygon: { guideLayers: this.guideLayers, snapDistance: 5 },
                marker: { guideLayers: this.guideLayers, snapVertices: false },
                draw: {
                    rectangle: false,
                    circle: false,
                    marker: {
                        icon: L.icon({
                            iconUrl: 'icon.png',
                            iconRetinaUrl: 'icon.png',
                            iconSize: [38, 95],
                            iconAnchor: [22, 94],
                            popupAnchor: [-3, -76]
                        })
                    }
                }
            });

            var that = this;
            this.map.on('draw:created', function(e) {
                // Route has been drawn, do any route initialization logic and
                // draw the resulting geoJSON. The resulting geoJSON may be
                // different than the one passed in. For example, bus routes must
                // be snapped to the road
                var type = e.layerType;
                var layer = e.layer;

                if(type === "polyline") {
                    that.handleRouteDraw(e);
                }
                else if(type === "marker") {
                	that.handleMarkerDraw(e);
                }
                else{
                    that.map.addLayer(layer);
                }
            });

            this.map.on('snap', function(e) {
				that.lastSnap = e;
				//console.log("layerID snapped to");
				//console.log(e.layer);
            });
        },

        handleModelSync: function () {
            var city = this.model.get('city');
            var newCentroid = city.centroid;
            // Only pan if the centroid has changed
            if (this.centroid == null || this.centroid != newCentroid) {
                console.log('panning to ' + newCentroid);
                this.map.setView(L.latLng(newCentroid[0], newCentroid[1]), 10, {
                    animate: true
                });
				this.centroid = newCentroid;

                // Draw the city boundary
                L.geoJson(city.boundary, {
                    style: function () {
                        return {
                            opacity: "0,7",
                            color: '#000000',
                            fillOpacity: 0
                        }
                    }
                }).addTo(this.map);
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
            return tinycolor.darken('#92278f', amount).toHexString();
        },

        calcEmpColor: function(bin, numBins) {
            var amount = Math.floor(bin * 100 / numBins);
            return tinycolor.darken('#f7941e', amount).toHexString();
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
			//console.log("geojson when added ");
			//console.log(geoJSON);
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

            //console.log("geojson from layer feature");
            //console.log(geoJson);

            this.routeFeatureGroup.addLayer(geoJson);
            this.guideLayers.push(geoJson);
            this.visibleLayers.routeLayers[route.get('id')] = geoJson;
        },

        onRouteRemoved: function(route) {
            var id = route.get('id');
            var layer = this.visibleLayers.routeLayers[id];

            // Remove the route layer, and then remove reference from our list
            // of layers
            this.routeFeatureGroup.removeLayer(layer);
            //this.guideLayers.remove(layer);
            delete this.visibleLayers.routeLayers[id];
        },

        handleRouteDraw: function(event) {
            new NewRouteView({geoJson: event.layer.toGeoJSON(),
                              routes: this.model.get('transitRoutes')}
            ).render();
        },

        onResize: function() {
            var height = $(window).height() - $('#title').height();
            $(this.el).height(height);
        },

        handleMarkerDraw: function(event){

//				this.map.addLayer(event.layer);
            //Loop through layer.feature.features, look for feature with property = stops,
            //If found, append latlng to end, //Get drive times between new point and old last point, send from and to points, append result to end of one time list, front of the other
            // /newstop?from=lat,lng&to=lat.lng
            // If not, create feature, //If there's one stop, no need for drive times
            var layerID = this.lastSnap.layer._leaflet_id;
            //console.log("layerID");
            //console.log(layerID);

            for(var l in this.routeFeatureGroup.getLayers()){
                //console.log("layer: "+l);
                //console.log(this.routeFeatureGroup.getLayers()[l])
                var groupLayer = this.routeFeatureGroup.getLayers()[l];
                var lLayers = groupLayer._layers;
                if(_.has(lLayers, layerID)){
                    for(var f in lLayers){
                        if (lLayers[f].feature.properties.geoType === 'stops') {

                            //console.log("Found Stops");
                            //console.log(lLayers[f].feature.geometry);
                            lLayers[f].feature.geometry.coordinates.push(
                                [event.layer.getLatLng().lng, event.layer.getLatLng().lat]);
                            //console.log(lLayers[f].feature.geometry.coordinates);

                            //Still need to compute drive times

                            var stopsFeature = lLayers[f].feature;

                            groupLayer.removeLayer(lLayers[f]);
                            groupLayer.addData(stopsFeature);
//                            for(var g in lLayers) {
//                                console.log("adding back layer " + g);
//
//                            }

                        }
                    }
                }
            }
            for(var l in this.routeFeatureGroup.getLayers()){
                console.log("new layers: "+l);
                console.log(this.routeFeatureGroup.getLayers()[l])
            }
		},

		geoJsonToPolyline: function(geoJSON){
			var coords = geoJSON.features[0].geometry.coordinates;
            var latlngs = new Array();

            for( var c in coords){
            	var coordinate = coords[c];
            	latlngs.push( L.latLng(coordinate[0], coordinate[1]));
            	//console.log(coordinate);
            }

			var polyLine = L.polyline(latlngs);
            return polyLine;

		}

    });

    return MapView;
});
