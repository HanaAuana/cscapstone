/**
 * Created by Nathan P on 2/11/14.
 *
 * GTFS is a standardized transit feed format
 * Google defines the spec, at:
 * https://developers.google.com/transit/gtfs/reference
 */

var tag = "GtfsModel";

define(['backbone',
    'underscore',
    'scripts/utils/capcon'],
    function(Backbone, Underscore, Logger){

        var GtfsModel = Backbone.Model.extend({

            defaults: {
                // The required GTFS text (csv) files
                'agencyTxt': null,
                'stopsTxt': null,
                'routesTxt': null,
                'tripsTxt': null,
                'stopTimesTxt': null,
                'calendarTxt': null
            },

            initialize: function() {
                logger.log(tag, "initializing");
            },

            setAgencyFile: function(file) {
                this.set({ agencyTxt: file });
            },

            setStopsFile: function(file) {
                this.set({stopsTxt: file});
            },

            setRoutesFiile: function(file) {
                this.set({routesTxt: file});
            },

            setTripsFile: function(file) {
                this.set({tripsTxt: file});
            },

            setStopTimesTxt: function(file) {
                this.set({stopTimesTxt: file});
            },

            setCalendarTxt: function(file) {
                this.set({calendarTxt: file});
            }
        });


        return GtfsModel;
    });