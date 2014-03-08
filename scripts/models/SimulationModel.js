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
    'collections/TripCollection',
    'views/ChooseCityView'
], function(Backbone,
            _,
            $,
            TransitRoute,
            Sim2Gtfs,
            TransitRouteCollection,
            BusMode,
            CityModel,
            TripModel,
            TripCollection,
            ChooseCityView)
{
    var SimulationModel = Backbone.Model.extend({

        defaults: {
            'sessionID': null,
            'transitRoutes': null,
            'sim2Gtfs': null,
            'city': null,
            'trips': null,
            'location': null
        },

        initialize: function() {
            console.log("SimulationModel : initializing");

            this.urlRoot = '/sim_session';
            this.id = this.cid;

            var transitRoutes = new TransitRouteCollection();
            var sim2Gtfs = new Sim2Gtfs({'transitRoutes': transitRoutes});
            var city = new CityModel();

            this.set({'transitRoutes': transitRoutes});
            this.set({'sim2Gtfs': sim2Gtfs});
            this.set({'city': city});

//            this.on("change:city", this.setTimezone, this);
//            this.get('city').on("change:timezone", this.setTimezone, this);

            // add in the the city selector
            var chooseCity = new ChooseCityView({model: this});


            this.generateTrips();
        },

        // Called from the ChooseCityView, once the user has entered a location
        // and it has been geocoded. Now we need to convert the long/lat
        // coordinates to a city and state code
        setLocation: function(longLat) {

            this.set({'location': longLat});

            var context = this;

            // Now that we've set the location, the server can do the rest.
            // But tell the server what needs changing. In particular, set the
            // city!
            var response = this.save(['city', 'sessionID'], {
                success: function() {
                    console.log('mode; persisted, id and city info updated');
                },
                error: function (model, response, options) {
                    console.log('persist fails');
                }});
            console.log(response);
        },

        setTimezone: function() {
            var timezone = this.get('city').get('timezone');
            this.get('sime2Gtfs').set({'timezone': timezone});
        },

        generateTrips: function() {

            var tripCollection = new TripCollection();

//            for(var i = 0; i < 15000; i++) {
//                var newTrip = new TripModel({'tripId': i});
//
//                // All census tract assignment logic
//
//                newTrip.set({'tract1': null});
//                newTrip.set({'tract2': null});
//
//                tripCollection.add(newTrip);
//            }

            this.set({'trips': tripCollection});
        }

    });

    return SimulationModel;
});