/**
 * Created by Nathan P on 3/23/14.
 */

define(['backbone',
    'underscore',
    'jquery',
    'text!HeaderViewTemplate.ejs'
], function(backbone, _, $, headerViewTemplate) {

    var HeaderView = Backbone.View.extend({

        id: "title",

        initialize: function() {
            $('#title').append(this.el);
        },

        render: function() {

            // Compile the template, and pass in the city list;
            var template = _.template(headerViewTemplate, {});
            // Load the compiled HTML into the Backbone "el"
            this.$el.html( template );
        }
    });

    return HeaderView;
});