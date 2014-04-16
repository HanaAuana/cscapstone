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

        rendered: false,

        initialize: function() {
            var layers = this.model.get('layers');
            // Compile the template, and pass in the layer list
            var template = _.template(mapLayerCtrlTemplate,
                    {layers: layers});
            // Load the compiled HTML into the Backbone "el"
            this.$el.html( template );

            var that = this;
            // Listen for events fired when the in focus tab changes. These
            // events are fired by the CtrlSelectorView
            Backbone.pubSub.on('ctrl-tab-change', function(id) {
                if(id === 'nav-tab-layers')
                    that.render();
                else
                    that.remove();
            });

        },

        render: function() {
            if(!this.rendered) {
                $('#ctrl-container').append(this.$el);
                this.rendered = true

                var that = this;
                $("#map-layer-ctrl").click(function(){
                    that.onLayerToggled();
                });
            }
        },

        remove: function() {
            if(this.rendered) {
                this.$el.remove();
                this.rendered = false;
            }
        },

        onLayerToggled: function() {

            var layers = this.model.get('layers');

            var changedLayers = {};

            for(var key in layers) {
                if(layers.hasOwnProperty(key)) {
                    var toggled = $('[name=' + key + ']:checked').length > 0;
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