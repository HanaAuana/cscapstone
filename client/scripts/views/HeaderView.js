/**
 * Created by Nathan P on 3/23/14.
 */

define(['backbone',
    'underscore',
    'json!config.json',
    'text!HeaderViewTemplate.ejs'
], function(backbone, _, config, headerViewTemplate) {

    var HeaderView = Backbone.View.extend({

        id: "title",

        initialize: function() {
            $('#title').append(this.el);
            var that = this;
            this.model.on('sync', function() {
		that.handleHeaderUpdate();
            }, this);
	    Backbone.pubSub.on('session-restore', function() {
		that.handleHeaderUpdate();
	    }); 
        },

 	handleHeaderUpdate: function() {
       	     var cityName = this.model.get('city').get('cityName');
	     var session = this.model.get('sessionName');
             this.render(cityName, session);
	},	

        render: function(cityName, session) {
            // Compile the template, and pass in the app name
            var template = _.template(headerViewTemplate, {
                name: config.appName,
                cityName: cityName ? cityName : "",
		session: session ? session : ""
            });
            // Load the compiled HTML into the Backbone "el"
            this.$el.html( template );
        }
    });

    return HeaderView;
});
