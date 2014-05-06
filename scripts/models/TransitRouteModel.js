/**
 * Created by Nathan P on 2/9/14.
 */

define(['backbone',
    'underscore',
    'models/SubwayModeModel',
    'models/BusModeModel'
], function(Backbone, Underscore, SubwayMode, BusMode){

    var TransitRouteModel = Backbone.Model.extend({

        defaults: {
            'geoJson': null,
            'mode': null,
            'headway': 15,
            'serviceId': 1, // Specifies operation hours in GTFS. Don't change
            'startServiceMins': 360, // 6am
            'endServiceMins': 1260, // = 9pm = 21hrs (480 for simplicity)
            'ridership': 0
        },

        initialize: function(attrs, options) {


            // Persist route id change to the geoJson. The map will need this
            this.on('change:id', function() {
                var id = this.get('id');
                var geoJson = this.get('geoJson');
                // Add id to feature collection properties, and to properties
                // of each feature
                geoJson.properties.id = id;
                for(var i = 0; i < geoJson.features.length; i++) {
                    geoJson.features[i].properties.routeId = id;
                }
            }, this);

            if(options !== undefined) {
                this.id = this.cid;
                this.urlRoot = '/route_sync';
                switch (options.mode) {
                    // Based on GTFS constants TODO other modes
                    case 'subway':
                        this.set({'mode': new SubwayMode()});
                        break;
                    case 'bus':
                        this.set({'mode': new BusMode()});
                        break;
                }



                var that = this;
                this.initializeGeoJSON(options.rawRouteFeature, function(model) {
                    if(options.onRouteInitialized)
                        options.onRouteInitialized.call(that, model);
                });
            }
        },

        // Gets the stops geometry object from the GeoJson
        getStopsGeo: function() {
            var features = this.get('geoJson').features;
            for(var i = 0; i < features.length; i++) {
                if(features[i].properties.geoType === 'stops') {
                    return features[i].geometry.coordinates;
                }
            }
        },

        // Gets the route geometry object from the GeoJson
        getRouteGeo: function() {
            var features = this.get('geoJson').features;
            for(var i = 0; i < features.length; i++) {
                if(features[i].properties.geoType === 'route') {
                    return features[i].geometry.coordinates;
                }
            }
        },

        getDriveTimes: function(direction) {
            var features = this.get('geoJson').features;
            for(var i = 0; i < features.length; i++) {
                if(features[i].properties.geoType === 'stops') {
                    if(direction === 'inbound')
                        return features[i].properties.inboundDriveTimes;
                    else if(direction === 'outbound')
                        return features[i].properties.outboundDriveTimes;
                }
            }
        },

		getRevenueHours: function() {
		    var inboundTimes = this.getDriveTimes('inbound');
		    var outboundTimes = this.getDriveTimes('outbound');
		    var dwellTime = this.get('mode').get('dwellTime');
		    var numTrips = (this.get('endServiceMins') - this.get('startServiceMins')) 
						/ this.get('headway');
		    console.log(numTrips);

		    // Initialize total route times to the total dwell time
		    var totalInboundTime = dwellTime * inboundTimes.length;
	   	    var totalOutboundTime = dwellTime * outboundTimes.length;

		    // Sum up the total inbound and outbound route times
		    for(var i = 0; i < inboundTimes.length; i++) 
				totalInboundTime += inboundTimes[i];
		    for(var i = 0; i < outboundTimes.length; i++)
				totalOutboundTime += outboundTimes[i];
	   		
	    	// Scale time by the number of trips run each day, and
	    	// convert to hours
	    	totalInboundTime = totalInboundTime * numTrips / 60;
	    	totalOutboundTime = totalOutboundTime * numTrips / 60;   

			var totalTime = totalInboundTime + totalOutboundTime;
			console.log(this.get('geoJson'));
		    return totalTime;	
		},

		getRouteCost: function() {
			var revenueHrs = this.getRevenueHours(); 
			var costPerRH = this.get('mode').get('costPerRH');
			console.log('Route ' + this.get('name') + ': Revenue hrs: ' + revenueHrs
				 + '. Cost per revenue hrs: ' + costPerRH);  
			return revenueHrs * costPerRH;
		},

        initializeGeoJSON: function(rawRouteFeature, callback) {
            // Wrap the route feature in a GeoJSON feature collection
            var geoJSON = {
                type: "FeatureCollection",
                properties: {},
                features: []
            }

            // Indicate that the drawn line is the route feature, and push it
            // onto the features list
            rawRouteFeature.properties = {
                geoType: "route"
            };
            geoJSON.features.push(rawRouteFeature);

            // Build and push an outline for the stops feature
            var stopsFeature = {
                type: "Feature",
                properties: {
                    geoType: "stops",
                    inboundDriveTimes: [],
                    outboundDriveTimes: []
                },
                geometry: {
                    type: "MultiPoint",
                    coordinates: []
                }
            };
            geoJSON.features.push(stopsFeature);

            this.set({'geoJson': geoJSON});
            console.log('%j', this.get('geoJson'));

            // Some routes must be snapped to roads. Handle accordingly.
            var modeString = this.get('mode').get('typeString');
            switch(modeString) {
                case 'subway':
                    break;
                case 'bus':
                    this.syncRoute(function(result) {
                        callback.call(this, result);
                    });
                    return;
            }

            callback.call(this, this);
        },

        syncRoute: function(callback) {

            var that = this;
            var response = this.save(['geoJson'], {
                success: function(model, response, options) {
                    // Set the updated route feature
                    that.get('geoJson').features = response;

                    console.log('route successfully synced');
                    callback.call(this, model);
                },
                error: function (model, response, options) {
                    console.log('route sync fails');
                    callback.call(this, false);
                }});
            console.log(response);
        }
    });

    return TransitRouteModel;
});
