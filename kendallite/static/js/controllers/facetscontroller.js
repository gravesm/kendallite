define(['views/facetitem', 'locationhash'], function(FacetView, hash) {

return Backbone.View.extend({

    initialize: function(opts) {
        this.collection.on("reset", this.refresh, this);
        this.f_id = opts.facet_id;
    },

    refresh: function(collection, opts) {
        this.$el.empty();
        collection.each(this.renderView, this);
    },

    renderView: function(item) {
        var view;

        item.set("f_id", this.f_id);

        if (_.contains(_.flatten([hash.get(this.f_id)]), item.get("value"))) {
            item.set("selected", true);
        }

        view = new FacetView({
            model: item
        });

        this.$el.append(view.render().el);
    }

});

});