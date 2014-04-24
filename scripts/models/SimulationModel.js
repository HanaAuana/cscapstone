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
    'views/NetworkStatsView',
    'views/ChooseCitySessionView',
    'views/UpdateRidershipView'
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
            NetworkStatsView,
            ChooseCitySessionView,
            UpdateRidershipView)
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
            console.log(transitRoutes);
            var city = new CityModel();

            this.set({'transitRoutes': transitRoutes,
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

            // and the city session selection
            new ChooseCitySessionView({'model': this}).render();

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
            var that = this;
            console.log(this.get('city'));
            var response = this.save(['city', 'sessionID'], {
                success: function() {
                    console.log('model persisted, id and city info updated');
                    // add the control selector
                    new CtrlSelectorView().render();

                    // and the map layer selector and render it by default
                    new MapLayerCtrlView({'model': that}).render();

                    // and the network stats
                    new NetworkStatsView({'collection': that.get('transitRoutes')});

                    // and the ridership update view
                    new UpdateRidershipView({'model': that}).render();

                    that.initSim2Gtfs();
                },
                error: function (model, response, options) {
                    console.log('persist fails');
                }});
            console.log(response);
        },

        initSim2Gtfs: function() {
            var timezone = this.get('city').timezone;
            var routes = this.get('transitRoutes');
            var sim2Gtfs = new Sim2Gtfs({'transitRoutes': routes,
                                         'timezone': timezone});
            this.set({'sim2Gtfs': sim2Gtfs});
        },

        onCitySessionSelected: function(sessionName, isNew, callback, context) {
            var url = '/city_session_auth?new=' + isNew
                                + '&session='  + sessionName;

            var that = this;
            $.ajax({
                url: url,
                type: 'GET',
                success: function(data, status, jqXHR) {

                    var success = false;
                    // User requests a new session name, and session name is
                    // unique
                    if(isNew && data.code === 1) {
                        success = true;
                    // User requests a load, and session exists on the server
                    } else if(!isNew && data.code === 0) {
                        success = true;
                    }
                    console.log(data);

                    callback.call(context||that, success);

                    // Set session name on success
                    if(success)
                        that.set({'sessionName': sessionName});
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error: " + textStatus + '\r\n' + errorThrown);
                    callback.call(context||that, false);
                }
            });
        }
    });

    return SimulationModel;
});