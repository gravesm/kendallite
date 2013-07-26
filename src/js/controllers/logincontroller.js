
define([
    'jquery',
    'backbone',
    'controllers/resultscontroller',
    'controllers/cartcontroller',
    'models/user',
    'appconfig'
], function($, Backbone, ResultsController, CartController, User, Config) {

var LoginController = Backbone.View.extend({

    el: $("#login"),

    events: {
        "click": "login"
    },

    initialize: function() {
        this.listenTo(User, "change:authenticated", this.update);

        $(window).on("message", this.finishLogin);
    },

    login: function(ev) {
        ev.preventDefault();

        if (User.isAuthenticated()) {
            User.set("authenticated", false);
        } else {
            this.startLogin();
        }

    },

    startLogin: function() {
        var url = Config.auth.domain + Config.auth.location;
        $("#ogp-iframe-login iframe").attr("src", url);
        $("#ogp-iframe-login").dialog({
            width: "auto",
            height: "auto"
        });
    },

    finishLogin: function(ev) {
        var origin = ev.originalEvent.origin,
            data = ev.originalEvent.data;

        if (origin === Config.auth.domain) {
            User.set({authenticated: true});
        }

        $("#ogp-iframe-login").dialog("close");

    },

    update: function() {

        var text = this.$el.text();

        text = (text == "Log In") ? "Log Out" : "Log In";

        this.$el.text(text);

        ResultsController.refresh();
        CartController.refresh();

    }

});

return new LoginController();

});