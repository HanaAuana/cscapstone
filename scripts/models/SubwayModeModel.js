/**
 * Created by Nathan P on 4/7/14.
 */

define(['backbone',
    'underscore',
    'models/TransitModeModel'
], function(Backbone, Underscore, TransitMode){

    var SubwayModeModel = TransitMode.extend({

        initialize: function() {
            // Subway type is 1, and we'll set the stop dwell time to 45 seconds
            TransitMode.prototype.set.call(this, {'type': 1,
                                                'typeString': 'subway',
                                                'dwellTime': 1.0,
												'costPerRH': 209.31});
        }
    });

    return SubwayModeModel;
});
