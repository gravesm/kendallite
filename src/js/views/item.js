define([
    'underscore',
    'backbone',
    'text!tmpl/item.html',
    'map/map'
], function(_, Backbone, Tmpl, Map) {

var ItemView = Backbone.View.extend({

    tagName: "div",

    className: "search-result",

    events: {
        mouseenter: "mouseenter",
        mouseleave: "mouseleave"
    },

    initialize: function(options) {

        this.template = _.template(Tmpl);
        this.listenTo(this.model, "change", this.render);

    },

    render: function() {

        var data = this.model.toJSON();

        this.$el.html( this.template(data) );

        return this;

    },

    mouseenter: function(ev) {

        var l, b, r, t;

        l = this.model.get("MinX");
        b = this.model.get("MinY");
        r = this.model.get("MaxX");
        t = this.model.get("MaxY");

        Map.addPreviewBox([l,b,r,t]);

    },

    mouseleave: function(ev) {

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