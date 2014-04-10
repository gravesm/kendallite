define(['views/item'], function(ItemView) {

    return Backbone.View.extend({

        el: $("#results"),

        initialize: function(opts) {
            this.options = opts;
            this.collection.on("reset", this.reload, this);
        },

        reload: function(collection, opts) {
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