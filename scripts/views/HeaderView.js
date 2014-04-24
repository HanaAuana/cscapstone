/**
 * Created by Nathan P on 3/23/14.
 */

define(['backbone',
    'underscore',
    'utils/globalvars',
    'text!HeaderViewTemplate.ejs'
], function(backbone, _, globalvars, headerViewTemplate) {

    var HeaderView = Backbone.View.extend({

        id: "title",

        initialize: function() {
            $('#title').append(this.el);
            var that = this;
            this.model.on('sync', function() {
                var cityName = that.model.get('city').cityName;
                that.render(cityName);
            }, this);
        },

        render: function(cityName) {
            // Compile the template, and pass in the app name
            var template = _.template(headerViewTemplate, {
                name: globalvars.appName,
                cityName: cityName ? cityName : ""
            });
            // Load the compiled HTML into the Backbone "el"
            this.$el.html( template );
        }
    });

    return HeaderView;
});