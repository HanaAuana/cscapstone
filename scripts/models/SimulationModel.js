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
    'views/ChooseCityView',
    'views/MapView'
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
            ChooseCityView,
            MapView)
{
    var SimulationModel = Backbone.Model.extend({

        defaults: {
            'sessionID': null,
            'transitRoutes': null,
            'sim2Gtfs': null,
            'city': null,
            'trips': null,
            'mapView': null
        },

        initialize: function() {

            this.urlRoot = '/sim_session';
            this.id = this.cid;

            var transitRoutes = new TransitRouteCollection();
            var sim2Gtfs = new Sim2Gtfs({'transitRoutes': transitRoutes});
            var city = new CityModel();

            this.set({'transitRoutes': transitRoutes,
                        'sim2Gtfs': sim2Gtfs,
                        'city': city});

//            this.on("change:city", this.setTimezone, this);
//            this.get('city').on("change:timezone", this.setTimezone, this);

            // add in the the city selector
            var chooseCity = new ChooseCityView({'model': this});
            chooseCity.render();

            // and the map
            var mapView = new MapView({'model': this});
            mapView.initMap();
//            this.set({'mapView': mapView});


            this.generateTrips();
        },

        // Called from the ChooseCityView, once the user has entered a location
        // and it has been geocoded. Now we need to convert the long/lat
        // coordinates to a city and state code
        setLocation: function(longLat) {

            this.get('city').set({'location': longLat});

//            this.set({'location': longLat});

            var that = this;

            // Now that we've set the location, the server can do the rest.
            // But tell the server what needs changing. In particular, set the
            // city!
            var response = this.save(['city', 'sessionID'], {
                success: function() {
                    console.log('model persisted, id and city info updated');
                    // Pan to the new location
//                    var mapView = context.get('mapView');
//                    if(mapView !== undefined && mapView !== null) {
////                        var loc = this.get('city').get('centroid');
//                        mapView.setLocation(context.get('city').get('centroid'));
//                    }

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