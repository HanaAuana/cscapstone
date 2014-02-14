/**
 * Created by Nathan P on 2/13/14.
 */

define(['backbone',
    'underscore'
], function(Backbone, Underscore){

    var TransitModeModel = Backbone.Model.extend({
        defaults: {
            // Mode type code, this should correspond to GTFS mode values
            // defined in the route_type field at:
            // https://developers.google.com/transit/gtfs/reference#routes_fields
            'type': -1
        }
    });

    return TransitModeModel;
});