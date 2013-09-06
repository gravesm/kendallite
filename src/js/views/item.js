
define([
    'jquery',
    'underscore',
    'backbone',
    'tmpl/template',
    'models/user',
    'map/map',
    'appconfig',
    'text!tmpl/FGDC_V2_a.xsl'
], function($, _, Backbone, Template, user, Map, Config, XSL) {

var ItemView = Backbone.View.extend({

    tagName: "div",

    className: "search-result",

    events: {
        mouseenter: "mouseenter",
        mouseleave: "mouseleave"
    },

    initialize: function(options) {
        this.template = Template(options.template) || Template("search");
        this.listenTo(this.model, "change", this.render);
        this.listenTo(this.model, "remove", this.itemRemoved);
    },

    render: function() {

        var data = this.model.toJSON();

        try {
            data.location = $.parseJSON(data.Location);
        } catch (e) {
            data.location = {};
        }

        this.$el.html( this.template( _.extend(data, user) ) );

        return this;

    },

    mouseenter: function(ev) {

        this.$el.addClass("result-highlight");

        var l, b, r, t;

        l = this.model.get("MinX");
        b = this.model.get("MinY");
        r = this.model.get("MaxX");
        t = this.model.get("MaxY");

        Map.addPreviewBox([l,b,r,t]);

    },

    mouseleave: function(ev) {

        this.$el.removeClass("result-highlight");

        Map.removePreviewBoxes();

    },

    itemRemoved: function() {
        Map.removePreviewBoxes();
    },

    zoom: function() {

        /**
         * @todo Need to stick this model somewhere so it appears at top of
         *       results.
         */

        Map.zoomToLayer(this.model);

    }

});

return ItemView;

});