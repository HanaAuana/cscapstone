/**
 * Created by Nathan P on 3/23/14.
 */

define(['jquery',
    'underscore',
    'backbone',
    'text!CtrlSelectorTemplate.ejs'
], function ($, _, Backbone, ctrlSelectorTemplate) {

    var CtrlSelectorView = Backbone.View.extend({

        template: undefined,

        events: {
//            'show.bs.tab': "onTabSelected"
            "click #ctrl-nav-tabs": "onTabSelected"
        },

        initialize: function() {
            this.template = _.template(ctrlSelectorTemplate, {});
            this.$el.html(this.template);


            Backbone.pubSub = _.extend({}, Backbone.Events);
        },

        render: function() {
            $('#ctrl-container').append(this.$el);
        },

        onTabSelected: function(e) {
            // Highlight the tab
            $('#ctrl-nav-tabs a[id=' + e.target.id + ']').tab('show');

            // We'll issue a global event whenever the tab is changed, so that
            // other view (i.e. control panes) can respond appropriately
            Backbone.pubSub.trigger('ctrl-tab-change', e.target.id);
        }
    });

    return CtrlSelectorView;
});