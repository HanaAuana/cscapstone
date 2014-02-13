/**
 * Created by Nathan P on 2/11/14.
 *
 * This is the beast, keeps track of an entire simulation instance
 */

define(['backbone',
    'underscore',
    'scripts/models/TransitRouteModel',
    'scripts/models/Sim2GtfsModel',
    'scripts/collections/TransitRouteCollection'
], function(Backbone,
            Underscore,
            TransitRoute,
            Sim2Gtfs,
            TransitRouteCollection)
{
    var SimulationModel = Backbone.Model.extend({

        defaults: {
            'sessionId': null,
            'transitRoutes': null
        },

        initialize: function() {
            console.log("SimulationModel : initializing");

            var transitRoutes = new TransitRouteCollection();
            var sim2Gtfs = new Sim2Gtfs({'transitRoutes': transitRoutes});

            this.set({'transitRoutes': transitRoutes});
            this.set({'sim2Gtfs': sim2Gtfs});
        }

    })

    return SimulationModel;
});