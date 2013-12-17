define([
    'views/facetitem',
    'locationhash'
], function(FacetView, hash) {

    return Backbone.View.extend({

        initialize: function(opts) {
            this.model.items.on("reset", this.refresh, this);
            this.$dialog = opts.dialog.find('.modal-body');
        },

        refresh: function(collection, opts) {

            var name = this.model.get("name");

            collection.each(function(item) {
                if (_.contains(_.flatten([hash.get(name)]), item.get("value"))) {
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