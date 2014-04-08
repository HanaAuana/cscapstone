/**
 * Created by Nathan P on 2/12/14.
 */

define(['backbone',
    'underscore',
    'tinycolor'
], function(Backbone, Underscore, tinycolor) {

    var TransitRouteCollection = Backbone.Collection.extend({


         routeId: 1,


        /**
         * Adds the route to the collection. DON'T DIRECTLY CALL Collection.add;
         * this function is necessary for setting route ids
         * @param route
         */
        addRoute: function(route) {

            var keysbyindex = Object.keys(tinycolor.names);

            // Set the route id and color
            // TODO don't pick random colors
            route.get('geoJson').properties.color = '#' + tinycolor.names[keysbyindex[this.routeId]];
            route.set({'id': this.routeId++});

            // And finally, add the route to the collection
            this.add([route]);

            console.log("collection size " + this.length);
        }
    });

    return TransitRouteCollection;

});
