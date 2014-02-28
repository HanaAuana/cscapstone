/**
 * Created by Nathan P on 1/30/14.
 */

requirejs.config({

    baseUrl: "../",

    paths: {
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        jquery: 'lib/jquery',
        text: 'lib/text'
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
