/**
 * Created by Nathan P on 2/9/14.
 */

define(['backbone',
    'underscore',
    'models/SubwayModeModel'
], function(Backbone, Underscore, SubwayMode){

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
            switch (options.modeId) {
                // Based on GTFS constants TODO other modes
                case 1:
                    this.set({'mode': new SubwayMode()});
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
        }
    });

    return TransitRouteModel;
});