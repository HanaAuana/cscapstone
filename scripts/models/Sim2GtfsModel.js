/**
 * Created by Nathan P on 2/11/14.
 */

var tag = "Sim2GtfsModel";

define(['backbone',
    'underscore',
    'scripts/utils/capcon',
    'scripts/models/GtfsModel',
    'scripts/models/GlobalVarsModel'],
    function(Backbone, Underscore, Logger, GtfsModel, GlobalVars){

        var commaDelim = ',';
        var lineBreak = '\r\n';
        var Sim2GtfsModel = GtfsModel.Model.extend({

            initialize: function() {
                buildAgencyGtfs();
            },

            buildAgencyGtfs: function() {
                // build headers
                var agencyTxt = 'agency_name' + commaDelim
                                + 'agency_url' + commaDelim
                                + 'agency_timezone' + commaDelim + lineBreak;

                // build entries
                // TODO: figure out the timezone
                agencyTxt += GlobalVars.get('gtfsAgencyName') + commaDelim
                            + GlobalVars.get('url') + commaDelim
                            + 'timezone' + commaDelim + lineBreak;

                this.set({'agencyTxt': agencyTxt});
            }
        });

        return Sim2GtfsModel;
    });