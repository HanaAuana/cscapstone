/**
 * Created by Nathan P on 2/11/14.
 *
 * This is the beast, keeps track of an entire simulation instance
 */

define(['backbone',
    'underscore',
    'jquery',
    'models/TransitRouteModel',
    'models/Sim2GtfsModel',
    'collections/TransitRouteCollection',
    'models/BusModeModel',
    'models/CityModel',
    'models/TripModel',
    'collections/TripCollection'
], function(Backbone,
            _,
            $,
            TransitRoute,
            Sim2Gtfs,
            TransitRouteCollection,
            BusMode,
            CityModel,
            TripModel,
            TripCollection)
{
    var SimulationModel = Backbone.Model.extend({

        defaults: {
            'sessionId': null,
            'transitRoutes': null,
            'sim2Gtfs': null,
            'city': null,
            'trips': null
        },

        initialize: function() {
            console.log("SimulationModel : initializing");

            var transitRoutes = new TransitRouteCollection();
            var sim2Gtfs = new Sim2Gtfs({'transitRoutes': transitRoutes});
            var city = new CityModel();

            this.set({'transitRoutes': transitRoutes});
            this.set({'sim2Gtfs': sim2Gtfs});
            this.set({'city': city});

            this.on("change:city", this.setTimezone, this);
            this.get('city').on("change:timezone", this.setTimezone, this);

            this.generateTrips();
        },

        setTimezone: function() {
            var timezone = this.get('city').get('timezone');
            this.get('sime2Gtfs').set({'timezone': timezone});
        },

        generateTrips: function() {

            var tripCollection = new TripCollection();

            for(var i = 0; i < 15000; i++) {
                var newTrip = new TripModel({'tripId': i});

                // All census tract assignment logic

                newTrip.set({'tract1': null});
                newTrip.set({'tract2': null});

                tripCollection.add(newTrip);
            }

            this.set({'trips': tripCollection});
        }

    });

    return SimulationModel;
});