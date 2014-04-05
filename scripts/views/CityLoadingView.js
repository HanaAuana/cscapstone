/**
 * Created by Nathan P on 4/2/14.
 */

define(['backbone',
    'underscore',
    'jquery',
    'utils/globalvars',
    'text!LoadingTemplate.ejs',
    'bootstrap'
], function(backbone, _, $, globalvars, loadingTemplate, bootstrap) {

    var CityLoadingView = Backbone.View.extend({

        dialogText: "Compiling data for your city. Please wait...",
        modalId: '#loadingAlert',

        initialize: function() {
            $('#dialog').append(this.el);
            // Remove thyself when model has synced with the server
            this.model.on('sync', function() {
                this.remove();
            }, this);

            $(this.modalId).modal({
                keyboard: false,
                show: true,
                backdrop: 'static'
            });

            // Compile the template, and pass in the dialog text
            var template = _.template(loadingTemplate, {
                text: this.dialogText
            });
            // Load the compiled HTML into the Backbone "el"
            this.$el.html( template );
        },

        render: function() {
            $(this.modalId).modal('show');
        },

        remove: function() {
            $(this.modalId).on('hidden.bs.modal', function () {
               $(this.el).remove();
            });
            $(this.modalId).modal('hide');
        }
    });

    return CityLoadingView;
});