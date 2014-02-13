/**
 * Created by Nathan P on 2/11/14.
 *
 * Contains "global" variables. Not sure if this is a good design pattern,
 * we'll be duplicating a bunch of data every time this script is executed
 */

var tag = "GlobalVarsModel";

define([
    'backbone',
    'underscore'
], function(Backbone, Underscore){

    var GlobalVarsModel = Backbone.Model.extend({

        defaults: {
            'appName': 'TransitBuilder',
            'gtfsAgencyName': 'TransitBuilder',
            'url': 'htt://www.example.com'
        }
    });

    return GlobalVarsModel;
});
