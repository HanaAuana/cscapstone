/**
 * Created by Nathan P on 2/27/14.
 *
 * Lets user pick a city
 */

define(['backbone',
    'underscore',
    'jquery',
    // load in the template as raw text
    'text!ChooseCityTemplate.ejs',
    // load the google maps api
    'gmaps'
], function(backbone, _, $, chooseCityTemplate, gmaps) {

    var ChooseCityView = Backbone.View.extend({

        cities: null,
        geocoder: null,

        initialize: function() {

//            // TODO: get the list of cities from our db
//            // for now, we have dummy list
//            this.cities = [['Tacoma', 'tacomaCode'],
//                ['San Francisco', "sfCode"]];

            this.geocoder = new gmaps.Geocoder();

            // Append the el (defaults to an empty div) to the document
            $('#title').append(this.el);
            this.render();
        },

        events: {
            // click listener for city selection
            "click #select_btn": "onCitySelected"
        },

        render: function() {

            // Compile the template, and pass in the city list;
            var template = _.template(chooseCityTemplate, {});
            // Load the compiled HTML into the Backbone "el"
            this.$el.html( template );
        },

        onCitySelected: function() {
            console.log('button clicked');

            // Get current radio button value, and pass to the simulation model
            var chosenCity = $('#enter_city').val();
            if (chosenCity.length > 0) {
                this.geocoder.geocode({
                    'address': chosenCity
                }, this.onGeocoded);
            }
        },

        onGeocoded: function(results, status) {
            if(status === gmaps.GeocoderStatus.OK) {
                // TODO more error checking on the result
                var loc = results[0].geometry.location;
                console.log('geocode to ' + loc);
            } else {
                console.log('geocode fails');
            }
        }
    });

    return ChooseCityView;
});