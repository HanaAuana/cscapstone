/**
 * Created by Nathan P on 3/23/14.
 */

define(['backbone',
    'underscore',
    'jquery',
    // load in the template as raw text
    'text!MapLayerCtrlTemplate.ejs'
], function(backbone, _, $, mapLayerCtrlTemplate) {

    var MapLayerCtrlView = Backbone.View.extend({

        layers: ["Population Levels",
            "Employment Levels",
            "Transit Network"],

        events: {
            "checked #mapLayerCtrl" : "onLayerToggled"
        },

        initialize: function() {

//            // Append the el (defaults to an empty div) to the document
//            $('#title').append(this.el);
        },

        render: function() {
            // Compile the template, and pass in the layer list;
            var template = _.template(mapLayerCtrlTemplate,
                    {layers: this.layers});
            // Load the compiled HTML into the Backbone "el"
            this.$el.html( template );
            $('#ctrl-container').append(this.$el);

        },

        onLayerToggled: function() {

        }

    });

    return MapLayerCtrlView;

});