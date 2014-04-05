/**
 * Created by Nathan P on 2/9/14. 
 * Continued by Ian Saad, finished on 2/18/14.
 */

 //TransitRoutModel
define(['backbone',
    'underscore',
    'scripts/utils/capcon'],
    function(backbone, underscore, logger){
        var TransitRouteModel = Backbone.Model.extend({
            defaults: {
                geoJson: null,
                mode: null,
                frequency: null
            },
            initialize: function() {
                logger.log("TransitRouteModel", "initializing");
            }
        })
});

//TripModel
define(['backbone',
    'underscore',
    'scripts/utils/capcon'],
    function(backbone, underscore, logger){
        var TripModel = Backbone.Model.extend({
            defaults: {
                route: null,
                start_time: null,
                bestHeuristic: null,
                bestRouteModel: null
            },
            initialize: function() {
                logger.log("TripModel", "initializing");
            }
        })
});

//TripModelChoice
define(['backbone',
    'underscore',
    'scripts/utils/capcon'],
    function(backbone, underscore, logger){
        var TripModelChoice = Backbone.Model.extend({
            defaults: {
                threshold: null
            },
            initialize: function() {
                logger.log("TripModelChoice", "initializing");
            }
        })
});

//TripModelNeed
define(['backbone',
    'underscore',
    'scripts/utils/capcon'],
    function(backbone, underscore, logger){
        var TripModelNeed = Backbone.Model.extend({
            defaults: {  
            },
            initialize: function() {
                logger.log("TripModelNeed", "initializing");
            }
        })
});

//TransitModeModel
define(['backbone',
    'underscore',
    'scripts/utils/capcon'],
    function(backbone, underscore, logger){
        var TransitModeModel = Backbone.Model.extend({
            defaults: {
                desirability: null,
                speed: null,
                cost: null,
                fare: null
            },
            initialize: function() {
                logger.log("TransitModeModel", "initializing");
            }
        })
});

//BusModel
define(['backbone',
    'underscore',
    'scripts/utils/capcon'],
    function(backbone, underscore, logger){
        var BusModel = Backbone.Model.extend({
            defaults: {  
            },
            initialize: function() {
                logger.log("BusModel", "initializing");
            }
        })
});

//CostModel
define(['backbone',
    'underscore',
    'scripts/utils/capcon'],
    function(backbone, underscore, logger){
        var CostModel = Backbone.Model.extend({
            defaults: {
            },
            initialize: function() {
                logger.log("CostModel";, "initializing");
            }
        })
});

//HeuristicModel
define(['backbone',
    'underscore',
    'scripts/utils/capcon'],
    function(backbone, underscore, logger){
        var CostModel = Backbone.Model.extend({
            defaults: {
                cost: null
            },
            initialize: function() {
                logger.log("HeuristicModel", "initializing");
            }
        })
});

//WalkingDist
define(['backbone',
    'underscore',
    'script/utils/capcon'],
    function(backbone, underscore, logger){
        var WalkingDist = Backbone.model.extent({
            defaults: {
            },
            initialize: function() {
                logger log("WalkingDist", "initializing");
            }
        })
    });

//ModeModel
define(['backbone',
    'underscore',
    'scripts/utils/capcon'],
    function(backbone, underscore, logger){
        var ModeModel = Backbone.Model.extend({
            defaults: {
            },
            initialize: function() {
                logger.log("ModeModel", "initializing");
            }
        })
});
//RoutingModel
define(['backbone',
    'underscore',
    'scripts/utils/capcon'],
    function(backbone, underscore, logger){
        var RoutingModel = Backbone.Model.extend({
            defaults: {
            },
            initialize: function() {
                logger.log("RoutingModel", "initializing");
            }
        })
});

//Straightness
define(['backbone',
    'underscore',
    'scripts/utils/capcon'],
    function(backbone, underscore, logger){
        var Straightness = Backbone.Model.extend({
            defaults: {   
            },
            initialize: function() {
                logger.log("Straightness", "initializing");
            }
        })
});

//Frequency
define(['backbone',
    'underscore',
    'scripts/utils/capcon'],
    function(backbone, underscore, logger){
        var Frequency = Backbone.Model.extend({
            defaults: {      
            },
            initialize: function() {
                logger.log("Frequency", "initializing");
            }
        })
});

//Transfers
define(['backbone',
    'underscore',
    'scripts/utils/capcon'],
    function(backbone, underscore, logger){
        var Transfers = Backbone.Model.extend({
            defaults: {
            },

            initialize: function() {
                logger.log("Transfers", "initializing");
            }
        })
});
define(]'backone',
    'underscore'
    'scripts/utils/capcon'],
    function(backbone, underscore, logger){

        var Transfers = Backbone.Model.ednet({
            defaults: {
                a: null,
                b: null,
                c: ''
            },
            initialize: function() {
                logger.log("Transfers", "initializing");
            }
        })
    });
