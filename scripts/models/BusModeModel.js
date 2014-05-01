/**
 * Created by Nathan P on 2/23/14.
 */

define(['backbone',
    'underscore',
    'models/TransitModeModel'
], function(Backbone, Underscore, TransitMode){

    var BusModeModel = TransitMode.extend({

        initialize: function() {
            // Bus type is 3, and we'll set the stop dwell time to 30 seconds
            TransitMode.prototype.set.call(this, {'type': 3,
                                                'typeString': 'bus',
                                                'dwellTime': 0.5,
												'costPerRH': 129.42});
        }
    });

    return BusModeModel;
});
