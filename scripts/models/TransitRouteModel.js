/**
 * Created by Nathan P on 2/9/14.
 */

define(['backbone',
    'underscore',
], function(Backbone, Underscore){

    var TransitRouteModel = Backbone.Model.extend({

        defaults: {
            'id': null,
            'geoJson': null,
            'mode': null
        },

        initialize: function() {
            console.log("TransitRouteModel : initializing");
        }
    })
});