/**
 * Created by Nathan P on 3/5/14.
 */

define(['backbone',
    'underscore',
    'models/TripModel'
], function(Backbone, Underscore, TripModel) {

    var TripCollection = Backbone.Collection.extend({

        model: TripModel

    });

    return TripCollection;
});
