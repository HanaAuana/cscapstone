/**
 * Created by Nathan P on 1/30/14.
 */

requirejs.config({

    baseUrl: "../",

    paths: {
        underscore: 'scripts/lib/underscore',
        backbone: 'scripts/lib/backbone',
        jquery: 'scripts/lib/jquery'
    },

    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: ''
        }
    }
});

// Start the main app logic.
requirejs([
    'backbone',
    'underscore',
    'scripts/models/GlobalVarsModel',
    'scripts/models/SimulationModel'
], function(Backbone, Underscore, GlobalVars, SimModel) {
    console.log("main : here we begin front end app logic");

    var globalVars = new GlobalVars();
    console.log("main : App name: "  + globalVars.get('appName'));

    var simModel = new SimModel();
});
