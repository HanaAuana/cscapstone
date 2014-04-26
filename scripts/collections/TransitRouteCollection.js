/**
 * Created by Nathan P on 2/12/14.
 */

define(['backbone',
    'underscore',
    'tinycolor',
    'models/TransitRouteModel',
    'models/TransitModeModel'
], function(Backbone, Underscore, tinycolor, TransitRoute, TransitMode) {

    var TransitRouteCollection = Backbone.Collection.extend({

         routeId: 1,
         colors: ['red', 'green', 'blue', 'yellow', 'cyan', 'orange', 'purple'],
         totalSatisfied: 0,
         totalUnsatisfied: 0,

        /**
         * Adds the route to the collection. DON'T DIRECTLY CALL Collection.add;
         * this function is necessary for setting route ids
         * @param route
         */
        addRoute: function(route) {

            // Set the route id and color
            // TODO don't pick random colors
            route.get('geoJson').properties.color = '#'
                    + tinycolor.names[this.colors[this.routeId % this.colors.length]];
            route.set({'id': this.routeId++});

            // And finally, add the route to the collection
            this.add([route]);

            console.log("collection size " + this.length);
        },

        handleRoutesRestore: function(routeData) {

            console.log(routeData);

            // Restore data for invidual routes
            var restoredRoutes = routeData.routes;
            for(var i = 0; i < restoredRoutes.length; i++) {
                var mode = new TransitMode(restoredRoutes[i].mode);
                restoredRoutes[i].mode = mode;
                this.add(new TransitRoute(restoredRoutes[i]));
            }

            // Restore global ridership data
            var globalStats = routeData.globalStats;
            if(globalStats !== undefined) {
                this.totalSatisfied = globalStats.totalSatisfied;
                this.totalUnsatisfied = globalStats.totalUnsatisfied;
            }          
        },

        getGlobalRidership: function() {
            return {
                totalSatisfied: this.totalSatisfied,
                totalUnsatisfied: this.totalUnsatisfied
            }
        }
    });

    return TransitRouteCollection;

});
