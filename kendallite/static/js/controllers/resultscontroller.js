define([
    'models/query',
    'views/item'
], function(Query, ItemView) {

    /**
     * Handles interaction in the results tab.
     */
    return Backbone.View.extend({

        el: $("#results"),

        initialize: function() {
            this.collection.on("reset", this.reload, this);
        },

        reload: function(collection, opts) {

            if (Query.get("start") > 0) {
                $(".previous").css("visibility", "visible");
            } else {
                $(".previous").css("visibility", "hidden");
            }

            if (Query.get("start") + this.options.results.windowsize < Query.get("total")) {
                $(".next").css("visibility", "visible");
            } else {
                $(".next").css("visibility", "hidden");
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