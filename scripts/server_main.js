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
        jquery: 'scripts/lib/jquery'
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

// Start the server, using the server and router modules as dependencies
requirejs(['scripts/server',
           'scripts/routers/router'],
            function(server, router) {
    server.start(router.route);
})