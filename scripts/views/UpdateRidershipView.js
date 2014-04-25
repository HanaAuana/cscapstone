/**
 * Created by Nathan P on 4/18/2014.
 */

define(['backbone',
    'underscore',
    'views/AlertModalView',
    'text!UpdateRidershipTemplate.ejs'
], function(backbone, _, AlertView, updateRidershipTemplate) {

    var UpdateRidershipView = Backbone.View.extend({

        render: function() {
            this.$el = _.template(updateRidershipTemplate, {});
            $('#ctrl-container-outer').append(this.$el);

            // Register listener on the button
            var that = this;
            $('#update-ridership-btn').click(function() {
                that.doUpdateRidership();
            });
        },

        doUpdateRidership: function() {
            console.log("do update ridership");

            var sim2Gtfs = this.model.get('sim2Gtfs');
            var transitRoutes = this.model.get('transitRoutes');
            // Ask for the GTFS in csv format
            var gtfs = sim2Gtfs.getGtfsCsv();

            var sessionName = this.model.get('sessionName');
            var stateID = this.model.get('city').stateID;
            var placeID = this.model.get('city').placeID;
            var url = '/update_ridership?session=' + sessionName
                            + '&state=' + stateID
                            + '&place=' + placeID;

            // Send the gtfs feed back to the server, associated with the
            // session name
            $.ajax({
                url: url,
                type: 'PUT',
                contentType: "application/json",
                data: JSON.stringify({
                    gtfs: gtfs,
                    routes: transitRoutes
                }),
                success: function(data, status, jqXHR) {
                    var alertString = 'We are informing the residents of your '
                                        + 'transit network upgrades. Please '
                                        + 'check back in several hours for '
                                        + 'updated ridership.';
                    new AlertView().render(alertString);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    var alertString = 'An error has occurred. Please try again '
                                        + 'in a few minutes.';
                    new AlertView().render(alertString);
                }
            })
        }
    });

    return UpdateRidershipView;
});