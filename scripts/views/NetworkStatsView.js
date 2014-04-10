/**
 * Created by Nathan P on 4/7/14.
 */
define(['backbone',
    'underscore',
    'jquery',
    'text!NetworkStatsTemplate.ejs'
], function(backbone, _, $, networkStatsTemplate) {

    var NetworkStatsView = Backbone.View.extend({

        rendered: false,

        initialize: function() {

            // Listen for changes in the route collection
            this.collection.on('add', this.updateRoutes, this);
            this.collection.on('remove', this.updateRoutes, this);

            this.updateRoutes();

            var that = this;
            // Listen for events fired when the in focus tab changes. These
            // events are fired by the CtrlSelectorView
            Backbone.pubSub.on('ctrl-tab-change', function(id) {
                if(id === 'nav-tab-stats' && !this.rendered)
                    that.render();
                else if(id !== 'nav-tab-stats')
                    that.remove();
            });
        },

        render: function() {
            // Load the compiled HTML into the Backbone "el"
            this.$el.html( this.template );

            $('#ctrl-container').append(this.$el);
            this.rendered = true
        },

        remove: function() {
            this.$el.remove();
            this.rendered = false;
        },

        updateRoutes: function() {
            console.log("Updating routes");
            var routes = [];
            var numRoutes = this.collection.length;
            for(var i = 0; i < numRoutes; i++) {
                var route = this.collection.at(i);
                var routeObj = {
                    name: route.get('name'),
                    ridership: route.get('ridership'),
                    color: route.get('geoJson').properties.color,
                    mode: route.get('mode').get('typeString')
                }
                routes.push(routeObj);
            }

            // Compile the template, and pass in the layer list
            this.template = _.template(networkStatsTemplate,
                {routes: routes});

            // Only re-render if the view is already visible
            if(this.rendered)
                this.render();
        }
    });

    return NetworkStatsView;

});