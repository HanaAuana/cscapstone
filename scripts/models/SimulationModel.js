/**
 * Created by Nathan P on 2/11/14.
 *
 * This is the beast, keeps track of an entire simulation instance
 */

var tag = "SimulationModel";

define(['backbone',
    'underscore',
    'scripts/utils/capcon',
    'scripts/models/TransitRouteModel',
    'scripts/models/Sim2GtfsModel'
], function(Backbone, Underscore, Logger, TransitRoute, Sim2Gtfs){

    var SimulationModel = Backbone.Model.extend({

        defaults: {
            'sessionId': null
        },

        initialize: function() {
            logger.log(tag, "initializing");

            var sim2Gtfs = new Sim2Gtfs();
            this.set({'sim2Gtfs': sim2Gtfs});
        }
    })

    return SimulationModel;
});