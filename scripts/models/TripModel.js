/**
 * Created by Nathan P on 3/5/14.
 */

define([Backbone,
    Underscore
], function(Backbone, _) {

    var TripModel = Backbone.Model.extend({

        defaults: {
            'tripId': null,
            'tract1': null,
            'tract2': null,
            'endpoint1': null,
            'endpoint': null
        }
    });

    return TripModel;


});
