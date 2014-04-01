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

        geocoder: null,
        model: null,

        events: {
            // click listener for city selection
            "click #select_btn": "onCitySelected"
        },

        initialize: function() {

            this.geocoder = new gmaps.Geocoder();

            // Append the el (defaults to an empty div) to the document
            $('#ctrl-container').append(this.el);
        },

        render: function() {

            // Compile the template, and pass in the city list;
            var template = _.template(chooseCityTemplate, {});
            // Load the compiled HTML into the Backbone "el"
            this.$el.html( template );
        },

        onCitySelected: function() {
            // hold on to our context
            var that = this;

            // get the entered text
            var chosenCity = $('#enter_city').val();
            if (chosenCity.length > 0) {
                // using google's geocode api
                this.geocoder.geocode({'address': chosenCity},
                    // callback fired on geocode completion
                    function(results, status) {
                        if(status === gmaps.GeocoderStatus.OK) {
                            // TODO more error checking on the result
                            var loc = results[0].geometry.location;
                            if(that.model !== undefined) {
                                console.log('setting loc');
                                that.model.setLocation(loc);

                                // TODO the model should probably control removal
                                that.remove();
                            }

                        } else {
                            console.log('geocode fails');
                        }
                });
            }
        }
    });

    return ChooseCityView;
});