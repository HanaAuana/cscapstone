/**
 * Created by Nathan P on 2/11/14.
 *
 * GTFS is a standardized transit feed format
 * Google defines the spec, at:
 * https://developers.google.com/transit/gtfs/reference
 */

define(['backbone',
    'underscore'
], function(Backbone, Underscore, CsvHelper) {

    var GtfsModel = Backbone.Model.extend({

        defaults: {
            // The required GTFS text (csv) files
            'agencyTxt': '',
            'stopsTxt': '',
            'routesTxt': '',
            'tripsTxt': '',
            'stopTimesTxt': '',
            'calendarTxt': ''
        },

        initialize: function() {
            console.log("GtfsModel : initializing");
        }
    });

    return GtfsModel;
});