/**
 * Created by Nathan P on 2/11/14.
 *
 * GTFS is a standardized transit feed format
 * Google defines the spec, at:
 * https://developers.google.com/transit/gtfs/reference
 */

define(['backbone',
    'underscore',
    'scripts/lib/csv2Array'
], function(Backbone, Underscore, csv2Array) {

    var GtfsModel = Backbone.Model.extend({

        defaults: {
            // The required GTFS text (csv) files
            'agencyTxt': '',
            'stopsTxt': '',
            'routesTxt': '',
            'tripsTxt': '',
            'stopTimesTxt': '',
            'calendarTxt': '',
            'commaDelim': ',',
            'lineBreak': '\r\n'
        },

        initialize: function() {
            console.log("GtfsModel : initializing");
        },

        // helper function for converting a csv into a 2d array
        csvToArray: function(csvString) {
            return csvString.csv2Array();
        },

        arrayToCsv: function(array) {
            var commaDelim = this.get('commaDelim');
            var lineBreak = this.get('lineBreak');

            var csv = '';
            for(var line in array) {
                for(var token in line) {
                    csv += (token + commaDelim);
                }
                csv += lineBreak;
            }
            return csv;
        }
    });

    return GtfsModel;
});