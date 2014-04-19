/**
 * Created by Nathan P on 4/18/14.
 */
define(['backbone',
    'underscore',
    'jquery',
    'text!ChooseCitySessionTemplate.ejs'
], function(backbone, _, $, citySessionTemplate) {

    var ChooseCitySessionView = Backbone.View.extend({

        events: {
            "click #city-session-btn": 'onCitySessionSelected'
        },

        render: function() {
            var template = _.template(citySessionTemplate, {});

            // Load the compiled HTML into the Backbone "el"
            this.$el.html(template);
            $('#dialog').append(this.$el);

            var that = this;
            $('#choose-city-session-modal').on('hidden.bs.modal', function () {
                $(that.$el).remove();
            });

            $('#choose-city-session-modal').modal('show');
        },

        remove: function() {
            $('#choose-city-session-modal').modal('hide');
        },

        onCitySessionSelected: function() {
            console.log('on city session selection');
            var loadSession = $('#inputCitySession').val();
            var newSession = $('#inputNewCitySession').val();

            // If user typed into both boxes they're an idiot. Ignore.
            if(!(loadSession.length > 0 && newSession.length > 0)) {
                var isNew = true;
                var sessionName = newSession;
                if(loadSession.length > 0) {
                    isNew = false;
                    sessionName = loadSession;
                }

                this.model.onCitySessionSelected(sessionName,
                                                 isNew,
                                                 function(result)
                {
                    if(result)
                        this.remove();
                }, this);
            }
        }
    });

    return ChooseCitySessionView;

});