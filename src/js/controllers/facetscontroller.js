
define([
    'jquery',
    'backbone',
    'collections/facetscollection',
    'views/facet'
], function($, Backbone, Facets, FacetView) {

var FacetsView = Backbone.View.extend({

    el: $("#ogp-facets"),

    initialize: function() {

        this.listenTo(Facets, "reset", this.refresh);

    },

    refresh: function() {

        this.$el.empty();
        Facets.each(this.renderView, this);

    },

    renderView: function(facet) {

        var view = new FacetView({
            model: facet
        });

        this.$el.append(view.render().el);

    }

});

return new FacetsView();

});