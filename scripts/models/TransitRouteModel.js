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
            'id': -1,
            'geoJson': null,
            'mode': null,
            'routeName': null,
            'headway': 15,
            'serviceId': 1, // Specifies operation hours in GTFS. Don't change
            'startServiceMins': 360, // 6am
            'endServiceMins': 480, // 1260 mins = 9pm = 21hrs
            'ridership': 0
        },

        initialize: function(attrs, options) {
//            console.log("initializing new route, mode " + options.modeId);
            switch (options.mode) {
                // Based on GTFS constants TODO other modes
                case 'subway':
                    this.set({'mode': new SubwayMode()});
                    break;
                case 'bus':
                    this.set({'mode': new BusMode()});
                    break;
            }

            // Persist route id change to the geoJson. The map will need this
            this.on('change:id', function() {
                this.get('geoJson').properties.id = this.get('id');
            }, this);
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
        }
    });

    return TransitRouteModel;
});