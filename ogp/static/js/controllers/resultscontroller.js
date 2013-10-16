define([
    'models/query',
    'views/item',
    'appconfig'
], function(Query, ItemView, Config) {

/**
 * Handles interaction in the results tab.
 */
var ResultsView = Backbone.View.extend({

    el: $("#results"),

    reload: function(collection, opts) {

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

return new ResultsView();

});