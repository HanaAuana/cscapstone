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
    'text!NewRouteTemplate.ejs',
    'text!LoadingDivTemplate.ejs'
], function(backbone, _, $, TransitRoute, newRouteTemplate, loadingDivTemplate) {

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
            this.loadingDiv = _.template(loadingDivTemplate, {
                text: "Building route..."
            })

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

            var that = this;
            console.log("on route created");
            var routeName = $('#inputRouteName').val();
            var routeMode = $('#inputRouteType').val();

            // Ignore button click if the user hasn't entered anything, and
            // ensure route name only contains alphanumeric characters
            if(routeName.length > 0
                && routeMode.length > 0
                && /^[a-zA-Z0-9]+$/.test(routeName))
            {
                new TransitRoute({'name': routeName,
                                    'headway': $('#inputHeadways').val()},
                                    {mode: routeMode,
                                    rawRouteFeature: this.rawGeoJson,
                                    onRouteInitialized: function(route) {
                    // Add the route to the collection after it's been initialized
                    $('#new-route-alert').modal('hide');
                    console.log(route);
                    that.routes.addRoute(route);
                }});

                // Update the modal to a loading screen as the route is built
                $('#cancel-route-btn').prop('disabled', true);
                $('#create-route-btn').prop('disabled', true);
                $('#new-route-form').remove();
                $('#new-route-body').append(this.loadingDiv);
            }
        }
    });

    return NewRouteView;
});