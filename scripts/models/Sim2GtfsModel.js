/**
 * Created by Nathan P on 2/11/14.
 */

define(['backbone',
    'underscore',
    'scripts/models/GtfsModel',
    'scripts/models/GlobalVarsModel'
], function(Backbone, Underscore, GtfsModel, GlobalVars){

    var Sim2GtfsModel = GtfsModel.extend({

        defaults: {
            'simModel': null,
            'transitRoutes': null
        },

        initialize: function() {
            this.buildAgencyGtfs();

            // register listeners on the transit routes, so that we update
            // the gtfs model when routes are updated/removed/added
            var transitRoutes = this.get("transitRoutes");
            transitRoutes.on("change", this.onRouteChanged, this);
            transitRoutes.on("remove", this.onRouteRemoved, this);
            transitRoutes.on("add", this.onRouteAdded, this);
        },

        buildAgencyGtfs: function() {
            var commaDelim = this.get('commaDelim');
            var lineBreak = this.get('lineBreak');
            var globalVars = new GlobalVars();

            // build headers
            var agencyTxt = 'agency_name' + commaDelim
                            + 'agency_url' + commaDelim
                            + 'agency_timezone' + commaDelim + lineBreak;

            // build entries
            // TODO: figure out the timezone
            agencyTxt += globalVars.get('gtfsAgencyName') + commaDelim
                        + globalVars.get('url') + commaDelim
                        + 'timezone' + commaDelim + lineBreak;

            this.set({'agencyTxt': agencyTxt});
        },

        onRouteChanged: function(model) {

        },

        onRouteAdded: function(model) {

        },

        onRouteRemoved: function(model) {

        }
    });

    return Sim2GtfsModel;
});