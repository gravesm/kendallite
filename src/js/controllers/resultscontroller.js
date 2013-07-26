
define([
    'jquery',
    'backbone',
    'underscore',
    'collections/resultscollection',
    'collections/cartcollection',
    'collections/previewcollection',
    'models/query',
    'views/item'
], function($, Backbone, _, Results, Cart, Previewed, Query, ItemView) {

/**
 * Handles interaction in the results tab.
 */
var ResultsView = Backbone.View.extend({

    el: $("#ogp-results"),

    initialize: function() {

        this.listenTo(Results, "reset", this.empty);
        this.listenTo(Results, "add", this.addResult);

    },

    empty: function() {
        this.$el.empty();
    },

    /**
     * Removes the current list of results from the DOM and reloads the contents
     * of the Results collection.
     *
     * Additionally, this makes sure that models are shared across the Cart and
     * Previewed collections by replacing the model instances in the Results
     * with any matching models in the other collections. Reusing the models
     * makes it much easier to maintain the state of the model between various
     * collections.
     */
    addResult: function(item) {

        var idx, cart, previewed;

        if (!this.$el.find("#pagination").length) {
            this.$el.append("<div id='pagination' style='text-align: center'><a href='#'>(show more)</a></div>");
        }

        if (Query.get("start") + 20 < Query.get("total")) {
            this.$el.find("#pagination").show();
        } else {
            this.$el.find("#pagination").hide();
        }

        idx = Results.indexOf(item);
        cart = Cart.get(item.id);
        previewed = Previewed.get(item.id);

        _.each([cart, previewed], function(model) {
            if (model) {
                Results.remove(model, {silent: true});
                Results.add(model, {at: idx, silent: true});
            }
        });

        this.renderView(Results.at(idx));

    },

    /**
     * Reloads list of results.
     *
     * Generally, this shouldn't be necessary to call since each result item
     * will re-render itself when something updates. This is called by the login
     * controller since the login process does not change item data, but rather
     * user data.
     */
    refresh: function() {

        Results.each(function(item) {
            item.trigger("change");
        });

    },

    /**
     * Renders the view.
     * @param {Backbone.Model} item model to render
     */
    renderView: function(item) {

        var view = new ItemView({
            model: item,
            template: "search"
        });

        this.$el.find("#pagination").before(view.render().el);

    }

});

return new ResultsView();

});