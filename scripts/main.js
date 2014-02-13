/**
 * Created by Nathan P on 1/30/14.
 */

var tag = 'main';

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
    'scripts/utils/capcon'
], function(Backbone, Underscore, GlobalVars, logger) {
    logger.log(tag, "Here we begin front end app logic");

    var globalVars = new GlobalVars();
    logger.log(tag, 'App name: ' + globalVars.get('appName'))
});
