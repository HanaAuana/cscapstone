/**
 * Created by Nathan P on 2/12/14.
 */

define(['backbone',
    'underscore',
    'scripts/models/TransitRouteModel'
], function(Backbone, Underscore, TransitRoute) {

    var TransitRouteCollection = Backbone.Collection.extend({

        model: TransitRoute

    });

    return TransitRouteCollection;

});
