/**
 * Created by Nathan P on 4/9/2014.
 */

/**
 * Created by Nathan P on 4/7/14.
 */
define(['backbone',
    'underscore',
    'jquery',
    'models/TransitRouteModel',
    'text!NewRouteTemplate.ejs'
], function(backbone, _, $, TransitRoute, newRouteTemplate) {

    var NewRouteView = Backbone.View.extend({


        events: {
            "click #create-route-btn": 'onRouteCreated'
        },

        initialize: function(attrs) {
            this.routes = attrs.routes;
            this.rawGeoJson = attrs.geoJson;
        },

        render: function() {
            var template = _.template(newRouteTemplate, {});

            // Load the compiled HTML into the Backbone "el"
            this.$el.html(template);
            $('#dialog').append(this.$el);

            var that = this;
            $('#new-route-alert').on('hidden.bs.modal', function () {
                $(that.$el).remove();
            });

            $('#new-route-alert').modal('show');
        },

        remove: function() {
            $('#new-route-alert').modal('hide');
        },

        onRouteCreated: function() {
            var routeName = $('#inputRouteName').val();
            var routeMode = $('#inputRouteType').val();

            // Ignore button click if the user hasn't entered anything
            if(routeName.length > 0 && routeMode.length > 0) {

                var route = new TransitRoute({'name': routeName},
                                            {'mode': routeMode,
                                            'rawRouteFeature': this.rawGeoJson});
                this.routes.addRoute(route);

                $('#new-route-alert').modal('hide');
            }
        }
    });

    return NewRouteView;

});