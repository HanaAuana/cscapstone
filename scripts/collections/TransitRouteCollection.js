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
         colors: ['red', 'green', 'blue', 'cyan', 'orange', 'purple', 
				  'firebrick', 'olive', 'peru', 'royalblue', 'yellow'],
         totalSatisfied: 0,
         totalUnsatisfied: 0,
         totalPctSatisfied: 0,

        /**
         * Adds the route to the collection. DON'T DIRECTLY CALL Collection.add
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

            var maxRouteID = 0;

            // Restore data for invidual routes
            var restoredRoutes = routeData.routes;
            for(var i = 0; i < restoredRoutes.length; i++) {
                restoredRoutes[i].mode = new TransitMode(restoredRoutes[i].mode);
                var route = new TransitRoute(restoredRoutes[i]);
                this.add(route);

                // Update max route id if appropriate
                if(route.get('id') > maxRouteID)
                    maxRouteID = route.get('id');
            }

            // Restore global ridership data
            var globalStats = routeData.globalStats;
            if(globalStats !== undefined) {
                this.totalSatisfied = globalStats.totalSatisfied;
                this.totalUnsatisfied = globalStats.totalUnsatisfied;
                this.totalPctSatisfied = globalStats.totalPctSatisfied;
            }         

            // Ensure new routes will have a unique ID, by setting the id
            // counter to be greater than the id's of existing routes
            this.routeId = ++maxRouteID; 
        },

		getSystemCost: function() {
			var totalCost = 0;
			for(var i = 0; i < this.length; i++) {
				totalCost += this.at(i).getRouteCost();
			}
			console.log("System cost: " + totalCost);
			return totalCost;
		},

        getGlobalRidership: function() {
            return {
                totalSatisfied: this.totalSatisfied,
                totalUnsatisfied: this.totalUnsatisfied,
                totalPctSatisfied: this.totalPctSatisfied
            }
        }
    });

    return TransitRouteCollection;

});
