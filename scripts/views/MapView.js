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

            var that = this;
            // Register listeners
            this.model.on('sync', this.handleModelSync, this);
            Backbone.pubSub.on('session-restore', function() {
                that.handleModelSync();
            });
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
            this.map = L.map(this.el );
            this.map.setView([39.809734, -98.555620],  4);

            // Add the OSM layer tiles
            //L.tileLayer('http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png').addTo(this.map);
            //L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'.addTo(this.map);
            
            L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg', {
				attribution: 'Tiles: <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data: <a href="http://openstreetmap.org">OpenStreetMap</a>',
				subdomains: '1234'
			}).addTo(this.map);

            this.routeFeatureGroup = L.featureGroup().addTo(this.map);
			//Initialize layers to snap to
            this.guideLayers = [];

            

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
            });

            this.map.on('snap', function(e) {
				that.lastSnap = e;
            });

            this.map.on('unsnap', function(e) {
                that.lastSnap = null;
            });
        },

        handleModelSync: function () {
            var city = this.model.get('city');
            var newCentroid = city.get('centroid');

            // Only pan if the centroid has changed
            if (this.centroid == null || this.centroid != newCentroid) {

                this.map.setView(new L.LatLng(newCentroid[0], newCentroid[1]), 10);

				this.centroid = newCentroid;


                //Lock map to the boundry of the city
                this.map.setMaxBounds(this.map.getBounds());

                //Initialize Draw Control
                var ourIcon = L.icon({
                    iconUrl: '/marker.png',
                    iconSize: new L.Point(35,35)
                });

                var options = {
                    draw: {
                        polyline: { guideLayers: this.guideLayers },
                        polygon: false,
                        circle: false, // Turns off this drawing tool
                        rectangle: false,
                        marker: { 
                            guideLayers: this.guideLayers, 
                            snapVertices: false,
                            icon: ourIcon,
                            repeatMode: true }
                    }
                };
                
                //Change toolbar messages
                L.drawLocal.draw.toolbar.buttons.polyline = 'Draw a route';
                L.drawLocal.draw.toolbar.buttons.marker = 'Add stops to your routes';

                var drawControl = new L.Control.Draw(options);
                drawControl.addTo(this.map);
                
				//Change tooltips
				L.drawLocal.draw.handlers.polyline.tooltip.start = 'Click to add points to your route. Try not to click in the water';
                L.drawLocal.draw.handlers.marker.tooltip.start = 'Click on a drawn route to add a stop. Add stops in the order you want them to function';
                
                // Draw the city boundary
                L.geoJson(city.get('boundary'), {
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
                var censusTracts = this.model.get('city').get('censusTracts');
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
                var censusTracts = this.model.get('city').get('censusTracts');
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

            var ourIcon = L.icon({
                iconUrl: '/marker.png',
                iconSize: new L.Point(35,35)

            });

            var color = geoJSON.properties.color;
            console.log("Route has been added, drawing");
            var geoJson = L.geoJson(geoJSON, {
                style: function (feature) {
                    return {
                        color: color,
                        weight: 8,
                        opacity: 1,
                        fillOpacity: 1
                    };
                },
                pointToLayer: function(feature, latlng) {
                    return new L.marker(latlng, {icon: ourIcon});
                }
            });

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
            delete this.visibleLayers.routeLayers[id];

            console.log(this.guideLayers);
            for(var i = 0; i < this.guideLayers.length; i++) {
                var featureLayers = this.guideLayers[i]._layers;
                for(var key in featureLayers) {
                    if(featureLayers[key].feature.properties.routeId == id) {
                        this.guideLayers.splice(i, 1);
                        break;                       
                    }
                }
            }
            
            
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

            if(this.lastSnap === null)
                return;

            var layerID = this.lastSnap.layer._leaflet_id;

            var groupLayers = this.routeFeatureGroup.getLayers();
            for(var l in groupLayers){
                //console.log("layer: "+l);
                //console.log(this.routeFeatureGroup.getLayers()[l])
                var groupLayer = groupLayers[l];
                var lLayers = groupLayer._layers;
                if(_.has(lLayers, layerID)){
                    for(var f in lLayers){
                        if (lLayers[f].feature.properties.geoType === 'stops') {

                            var stopsFeature = lLayers[f].feature;
                            var point = [event.layer.getLatLng().lng,
                                            event.layer.getLatLng().lat];

                            // Compute driving time if there is more than one
                            // stop on the route
                            var numStops = stopsFeature.geometry.coordinates.length;
                            if(numStops > 0) {
                                
                                var lastPoint = stopsFeature.geometry.coordinates[numStops-1];
                                // Get the mode by acessing the transit routes
                                // collection
                                var routeId = stopsFeature.properties.routeId;                                
                                var modeString = this.model.get('transitRoutes')
                                                    .get(routeId)
                                                    .get('mode')
                                                    .get('typeString');

                                // Compute driving time, and add to the geoJSON
                                var url = '/new_stop'
                                        + '?from=' + lastPoint[0] + ',' + lastPoint[1]
                                        + '&to=' + point[0] + ',' + point[1]
                                        + '&mode=' + modeString;
                                $.ajax({
                                    url: url,
                                    type: 'GET',
                                    success: function (data, status, jqXHR) {
                                        data = JSON.parse(data);
                                        // Convert time to minutes and round to 
					// 2 decimal points at most
                                        var inboundMins = (data.inboundTime / 60).toFixed(2);
                                        var outboundMins = (data.outboundTime / 60).toFixed(2);
                                        // Add the driving times to the geoJSON
                                        stopsFeature.properties
                                            .inboundDriveTimes
                                            .push(parseFloat(inboundMins));
                                        stopsFeature.properties
                                            .outboundDriveTimes
                                            .push(parseFloat(outboundMins));

                                        console.log(modeString + " " + data.inboundTime + " " + data.outboundTime);

                                        // Add the point this route's GeoJSON                      
                                        stopsFeature.geometry.coordinates.push(point);
                                        // Add the point to the map       
                                        groupLayer.removeLayer(lLayers[f]);
                                        groupLayer.addData(stopsFeature);

                                        // Trigger an event so that the GTFS
                                        // feed can update appropriately
                                        Backbone.pubSub.trigger('new-transit-stop',
                                               stopsFeature.properties.routeId);
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        console.log("error: " + textStatus + '\r\n' + errorThrown);
                                    }
                                });
                            } else {
                                // Always add the point to the map if it's the
                                // first point 
                                // TODO this is buggy! We should geocode this
                                // to ensure that the point is valid
                                stopsFeature.geometry.coordinates.push(point);
                                groupLayer.removeLayer(lLayers[f]);
                                groupLayer.addData(stopsFeature);
                            }                          
                        }
                    }
                }
            }
		}
    });

    return MapView;
});
