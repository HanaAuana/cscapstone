/**
 * Created by Nathan P on 1/25/14.
 */

// "Import" the server and router modules
var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require,
    baseUrl: "C:/Users/Nathan P/capstone"
});

requirejs(['scripts/server',
           'scripts/routers/router'],
            function(server, router) {
    server.start(router.route);
})