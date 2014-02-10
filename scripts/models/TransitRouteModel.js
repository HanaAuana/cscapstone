/**
 * Created by Nathan P on 2/9/14.
 */

var tag = "TransitRouteModel";

define(['backbone',
    'underscore',
    'scripts/utils/capcon'],
    function(backbone, underscore, logger){

        var TransitRouteModel = Backbone.Model.extend({

            defaults: {
                geoJson: null,
                mode: null
            },

            initialize: function() {
                logger.log(tag, "initializing");
            }
        })
});