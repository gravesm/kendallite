define([
    'models/query',
    'views/item'
], function(query, ItemView) {

    /**
     * Handles interaction in the results tab.
     */
    return Backbone.View.extend({

        el: $("#results"),

        initialize: function(opts) {
            this.options = opts;
            this.collection.on("reset", this.reload, this);
        },

        reload: function(collection, opts) {
            var start = parseInt(query.get("qs")) || 0,
                windowsize = parseInt(this.options.results.windowsize),
                total = parseInt(query.get("total"));

            $(".page-middle").text(total + " Results");

            if (start > 0) {
                $(".page-left a").removeClass("page-disabled");
            } else {
                $(".page-left a").addClass("page-disabled");
            }

            if (start + windowsize < total) {
                $(".page-right a").removeClass("page-disabled");
            } else {
                $(".page-right a").addClass("page-disabled");
            }

            this.$el.empty();

            collection.each(this.renderView, this);
        },

        /**
         * Renders the view.
         * @param {Backbone.Model} item model to render
         */
        renderView: function(item) {

            var view = new ItemView({
                model: item
            });

            this.$el.append(view.render().el);

        }

    });

});