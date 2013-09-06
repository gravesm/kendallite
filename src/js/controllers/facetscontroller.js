
define([
    'jquery',
    'backbone',
    'collections/facetscollection',
    'views/facet'
], function($, Backbone, Facets, FacetView) {

var FacetsView = Backbone.View.extend({

    el: $("#facets"),

    initialize: function() {

        this.listenTo(Facets, "reset", this.refresh);

    },

    refresh: function() {

        this.$el.empty();
        $("#facet-dialogs").empty();
        Facets.each(this.renderView, this);

    },

    renderView: function(facet) {

        var view = new FacetView({
            model: facet
        });

        this.$el.append(view.render().el);

        var dview = new FacetView({
            model: facet,
            className: "modal fade",
            id: facet.get("name"),
            dialog: true
        });

        $("#facet-dialogs").append(dview.render().el);

    }

});

return new FacetsView();

});