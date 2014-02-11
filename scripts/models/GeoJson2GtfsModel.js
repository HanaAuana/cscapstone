/**
 * Created by Nathan P on 2/11/14.
 */

var tag = "GeoJson2GtfsModel";

define(['backbone',
    'underscore',
    'scripts/utils/capcon',
    'scripts/models/GtfsModel'],
    function(Backbone, Underscore, Logger, GtfsModel){

        var GeoJson2GtfsModel = GtfsModel.Model.extend({

            // Here goes all GeoJson -> GTFS conversion logic
        });

        return GeoJson2GtfsModel;
    });