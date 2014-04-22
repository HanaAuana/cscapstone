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
        underscore: 'scripts/lib/underscore',
        backbone: 'scripts/lib/backbone',
        clipper: 'scripts/lib/clipper-min'
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
        },
    }
});

// Start the server, using the server and router modules as dependencies
requirejs(['scripts/server',
    'scripts/utils/services'
], function (server, services) {

    // Only start services if specified
    process.argv.forEach(function (val) {
        if(val === "--services")
            services.startServices();
    });

    // But always start the server
    server.start();
});
