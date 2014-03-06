/**
 * Created by Nathan P on 1/30/14.
 */

requirejs.config({

    baseUrl: "../",

    paths: {
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        jquery: 'lib/jquery',
        text: 'lib/text',
        async: 'lib/async'
    },

    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },

        'underscore': {
            exports: '_'
        }
    }
});

// GET GOOGLE MAPS INTO AN AMD MODULE. DIS UGLY. From:
// http://blog.millermedeiros.com/requirejs-2-0-delayed-module-evaluation-and-google-maps/
define('gmaps', ['async!http://maps.google.com/maps/api/js?v=3&sensor=false'],
    function(){
        // return the gmaps namespace for brevity
        return window.google.maps;
    });

// Start the main app logic.
requirejs([
    'backbone',
    'underscore',
    'jquery',
    'models/GlobalVarsModel',
    'models/SimulationModel',
    'views/ChooseCityView'
], function(Backbone, _, $, GlobalVars, SimModel, ChooseCityView) {
    console.log("here we begin front end app logic");
    var globalVars = new GlobalVars();
    console.log("app name: "  + globalVars.get('appName'));

    // TODO check for persisted sessions, for now we build a new session
    // add in the map view

    // add in the the city selector
    var chooseCity = new ChooseCityView();

    var simModel = new SimModel();
});
