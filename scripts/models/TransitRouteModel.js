/**
 * Created by Nathan P on 2/9/14.
 */

define(['backbone',
    'underscore'
], function(Backbone, Underscore){

    var TransitRouteModel = Backbone.Model.extend({

        defaults: {
            'id': -1,
            'geoJson': null,
            'mode': null,
            'routeName': null,
            'headway': 15,
            'serviceId': 1, // Specifies operation hours in GTFS. Don't change
            'startServiceMins': 360, // 6am
            'endServiceMins': 1260 // 9pm (21hrs)
        },

        initialize: function() {
            console.log("TransitRouteModel : initializing");
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

        getStopsDriveTimes: function() {
            var features = this.get('geoJson').features;
            for(var i = 0; i < features.length; i++) {
                if(features[i].properties.geoType === 'stops') {
                    return features[i].properties.drivingTimes;
                }
            }
        }
    });

    return TransitRouteModel;
});