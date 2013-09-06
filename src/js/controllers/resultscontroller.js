
define([
    'jquery',
    'backbone',
    'underscore',
    'collections/resultscollection',
    'models/query',
    'views/item',
    'appconfig'
], function($, Backbone, _, Results, Query, ItemView, Config) {

/**
 * Handles interaction in the results tab.
 */
var ResultsView = Backbone.View.extend({

    el: $("#results"),

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
     */
    addResult: function(item) {

        if (Query.get("start") > 0) {
            $(".previous").css("visibility", "visible");
        } else {
            $(".previous").css("visibility", "hidden");
        }

        if (Query.get("start") + Config.results.windowsize < Query.get("total")) {
            $(".next").css("visibility", "visible");
        } else {
            $(".next").css("visibility", "hidden");
        }

        this.renderView(item);

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

        this.$el.append(view.render().el);

    }

});

return new ResultsView();

});