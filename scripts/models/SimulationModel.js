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
    'views/ChooseCityView',
    'views/MapView',
    'views/MapLayerCtrlView',
    'views/HeaderView',
    'views/CtrlSelectorView',
    'views/CityLoadingView',
    'views/NetworkStatsView'
], function(Backbone,
            _,
            $,
            TransitRoute,
            Sim2Gtfs,
            TransitRouteCollection,
            BusMode,
            CityModel,
            ChooseCityView,
            MapView,
            MapLayerCtrlView,
            HeaderView,
            CtrlSelectorView,
            CityLoadingView,
            NetworkStatsView)
{
    var SimulationModel = Backbone.Model.extend({

        defaults: {
            'sessionID': null,
            'transitRoutes': null,
            'sim2Gtfs': null,
            'city': null
        },

        initialize: function() {

            this.urlRoot = '/sim_session';
            this.id = this.cid;

            var transitRoutes = new TransitRouteCollection();
//            var sim2Gtfs = new Sim2Gtfs({'transitRoutes': transitRoutes});
            var city = new CityModel();

            this.set({'transitRoutes': transitRoutes,
//                        'sim2Gtfs': sim2Gtfs,
                        'city': city});

            this.set({"layers" : {
                    popLevels: {name: "Population Levels",
                                toggled: false},
                    empLevels: {name: "Employment Levels",
                                toggled: false},
                    transitNet: {name: "Transit Network",
                                toggled: false}}
            });

            // add in the header
            new HeaderView({'model': this}).render();

            // and the city selector
            var chooseCity = new ChooseCityView({'model': this});
            chooseCity.render();

            // and the map
            var mapView = new MapView({'model': this});
            mapView.initMap();
        },

        // Called from the ChooseCityView, once the user has entered a location
        // and it has been geocoded. Now we need to convert the long/lat
        // coordinates to a city and state code
        setLocation: function(longLat) {

            new CityLoadingView({'model': this}).render();

            this.get('city').set({'location': longLat});

            // Now that we've set the location, the server can do the rest.
            // But tell the server what needs changing. In particular, set the
            // city!
            var response = this.save(['city', 'sessionID'], {
                success: function() {
                    console.log('model persisted, id and city info updated');
                },
                error: function (model, response, options) {
                    console.log('persist fails');
                }});
            console.log(response);

            // add the control selector
            new CtrlSelectorView().render();

            // and the map layer selector and render it by default
            new MapLayerCtrlView({'model': this}).render();

            // and the network stats
            new NetworkStatsView({'collection': this.get('transitRoutes')});
        },

        setTimezone: function() {
            var timezone = this.get('city').get('timezone');
            this.get('sime2Gtfs').set({'timezone': timezone});
        }

    });

    return SimulationModel;
});