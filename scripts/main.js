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
        async: 'lib/async',
        leaflet: 'leaflet/leaflet',
        leafletDraw: "leaflet/leaflet-draw"
    },

    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },

        'underscore': {
            exports: '_'
        },
        'leaflet': {
            exports: 'L'
        },
        'leafletDraw':{
        	deps: ['leaflet'],
        	exports: 'leafletDraw'
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
    'utils/globalvars',
    'models/SimulationModel',
    'views/ChooseCityView'
], function(Backbone, _, $, globalvars, SimModel, ChooseCityView) {
    console.log("here we begin front end app logic");
    console.log("app name: "  + globalvars.appName);

    // TODO check for persisted sessions, for now we build a new session
    // add in the map view
    var simModel = new SimModel();
});
