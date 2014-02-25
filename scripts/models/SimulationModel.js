/**
 * Created by Nathan P on 2/11/14.
 *
 * This is the beast, keeps track of an entire simulation instance
 */

define(['backbone',
    'underscore',
    'jquery',
    'scripts/models/TransitRouteModel',
    'scripts/models/Sim2GtfsModel',
    'scripts/collections/TransitRouteCollection',
    'scripts/models/BusModeModel'
], function(Backbone,
            Underscore,
            $,
            TransitRoute,
            Sim2Gtfs,
            TransitRouteCollection,
            BusMode)
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

            // TESTING SHIT TODO: get rid of
            var transitRoute = new TransitRoute();
            var transitMode = new BusMode();

            $.get('/assets/sampleGeoJson.json', function(data) {
                console.log('SimulationModel : sampleGeoJson received');
                transitRoute.set({'mode': transitMode,
                                    'geoJson': data});
                transitRoutes.add(transitRoute);
                transitRoutes.remove(transitRoute);
            });

        }

    });

    return SimulationModel;
});