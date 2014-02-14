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
            var features = this.get('geoJson');
            for(var feature in features) {
                if(features.properties.type === 'stops') {
                    return feature.geometry.coordinates;
                }
            }
        },

        // Gets the route geometry object from the GeoJson
        getRouteGeo: function() {
            var features = this.get('geoJson');
            for(var feature in features) {
                if(features.properties.type === 'route') {
                    return feature.geometry.coordinates;
                }
            }
        }
    });

    return TransitRouteModel;
});