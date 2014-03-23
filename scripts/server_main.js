/**
 * Created by Nathan P on 1/25/14.
 *
 * This starts the server.
 * In the command line from /scripts, run:
 *    node server_main.js
 */

// This will be the only dependency we specify using node module syntax. From
// this point on we use requirejs syntax.
var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require,
    baseUrl: "../capstone/",

    paths: {
    	jquery: 'scripts/lib/jquery',
        underscore: 'scripts/lib/underscore',
        backbone: 'scripts/lib/backbone',
        leaflet: "scripts/leaflet/leaflet",
        leafletDraw: "scripts/leaflet/leaflet-draw"
    },

    shim: {
    	'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }, 
        'leaflet': {
            exports: 'L'
        },
        'leafletDraw':{
        	deps: ['leaflet'],
        	exports: 'L'
        }
    }
});

// Start the server, using the server and router modules as dependencies
requirejs(['scripts/server',
    'scripts/routers/router',
    'scripts/utils/stategeograbber',
    'scripts/utils/censusAPI'
], function (server, router, stategeo, censusAPI) {
      server.start(router.route);
//    stategeo.checkGeographies();
});
