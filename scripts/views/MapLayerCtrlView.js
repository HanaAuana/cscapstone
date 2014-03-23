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

        events: {
            "click #map-layer-ctrl" : "onLayerToggled"
        },

        render: function() {

            var layers = this.model.get('layers');

            // Compile the template, and pass in the layer list;
            var template = _.template(mapLayerCtrlTemplate,
                    {layers: layers});
            // Load the compiled HTML into the Backbone "el"
            this.$el.html( template );
            $('#ctrl-container').append(this.$el);

        },

        onLayerToggled: function() {

            var layers = this.model.get('layers');

            var changedLayers = {};

            for(var key in layers) {
                if(layers.hasOwnProperty(key)) {
                    var toggled = $('[name=' + key + ']:checked').length > 0;
//                    console.log('toggling ' + key + " to " + toggled);
                    if(layers[key].toggled !== toggled) {
                        changedLayers[key] = layers[key];
                    }
                    layers[key].toggled = toggled;
                }

            }

            this.model.set({layers: layers});
            // Event won't automatically trigger because the variable pointer
            // doesn't actually change. Explicitly invoke the event then
            this.model.trigger('change:layers', changedLayers);
        }

    });

    return MapLayerCtrlView;

});