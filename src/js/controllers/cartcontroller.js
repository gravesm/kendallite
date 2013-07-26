
define([
    'jquery',
    'backbone',
    'collections/cartcollection',
    'views/item',
    'controllers/downloadcontroller'
], function($, Backbone, Cart, ItemView, DownloadController) {

/**
 * The cart controller manages interaction with the cart tab.
 */
var CartController = Backbone.View.extend({

    el: $("#cart-tab"),

    events: {
        "click #ogp-action-download": _.bind(DownloadController.show, DownloadController)
    },

    initialize: function() {

        this.listenTo(Cart, "add remove", this.refresh);

        this.$cart = this.$el.find("#ogp-cart");

    },

    /**
     * Refreshes the DOM with the current Cart contents.
     */
    refresh: function() {

        var id, tab;

        this.$cart.empty();

        Cart.each(this.renderView, this);

        id = this.$el.attr("id");

        tab = this.$el.parent().find("a[href='#"+id+"'] span");

        tab.text("Cart (" + Cart.length + ")");

    },

    /**
     * Adds a rendered Cart item to the DOM.
     *
     * @param {Backbone.Model} item Item to render
     */
    renderView: function(item) {

        var view = new ItemView({
            model: item,
            template: "cart"
        });

        this.$cart.append(view.render().el);

    }

});

return new CartController();

});