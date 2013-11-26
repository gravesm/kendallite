define([
    'views/facetitem',
    'models/query'
], function(FacetView, Query) {

    return Backbone.View.extend({

        initialize: function() {
            this.model.items.on("reset", this.refresh, this);
            this.$dialog = this.options.dialog.find('.modal-body');
        },

        refresh: function(collection, opts) {

            var name = this.model.get("name");

            collection.each(function(item) {
                if (_.contains(Query.get(name), item.get("value"))) {
                    item.set("selected", true);
                }
            });

            collection.sort();

            this.$el.empty();
            this.$dialog.empty();

            _.each(collection.slice(0,4), this.renderView, this);

            collection.each(this.renderDialog, this);

        },

        renderView: function(facet) {

            var view = new FacetView({
                model: facet,
                facet: this.model.get("name")
            });

            this.$el.append(view.render().el);

        },

        renderDialog: function(facet) {

            var view = new FacetView({
                model: facet,
                facet: this.model.get("name")
            });

            this.$dialog.append(view.render().el);
        }

    });

});