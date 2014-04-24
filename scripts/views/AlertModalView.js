/**
 * Created by Nathan P on 4/18/2014.
 */

define(['backbone',
    'underscore',
    // load in the template as raw text
    'text!AlertModalTemplate.ejs'
], function(backbone, _, alertModalTemplate) {

    var AlertModalView = Backbone.View.extend({

        events: {
            'click #alert-modal-ok': 'remove'
        },

        render: function(alertText) {

            this.$el = _.template(alertModalTemplate, {
                text: alertText
            });

            $('#dialog').append(this.$el);

            var that = this;
            $('#new-route-alert').on('hidden.bs.modal', function () {
                this.$el.remove();
            });

            $('#alert-modal').modal('show');
        },

        remove: function() {
            $('#alert-modal').modal('hide');
        }
    });

    return AlertModalView;
});