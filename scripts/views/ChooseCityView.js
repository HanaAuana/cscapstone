/**
 * Created by Nathan P on 2/27/14.
 *
 * Lets user pick a city
 */

define(['backbone',
    'underscore',
    'jquery',
    // load in the template as raw text
    'text!ChooseCityTemplate.ejs'
], function(backbone, _, $, chooseCityTemplate) {

    var ChooseCityView = Backbone.View.extend({

        cities: null,
        // Set the DOM element tag
        el:  $('#ctrl_panel'),

        initialize: function() {

            // TODO: get the list of cities from our db
            // for now, we have dummy list
            this.cities = [['Tacoma', 'tacomaCode'],
                ['San Francisco', "sfCode"]];

            this.render();
        },

        events: {
            // click listener for city selection
            "click #select_btn": "onCitySelected"
        },

        render: function() {

            // Compile the template, and pass in the city list;
            var template = _.template(chooseCityTemplate, {cities : this.cities});
            // Load the compiled HTML into the Backbone "el"
            this.$el.html( template );
        },

        onCitySelected: function() {
            console.log('button clicked');

            // Get current radio button value, and pass to the simulation model
            var selected = $("input[type='radio'][name='city']:checked");
            if (selected.length > 0) {
                cityCode = selected.val();
                console.log('handling city selection of: ' + cityCode);
            }
        }
    });

    return ChooseCityView;
});