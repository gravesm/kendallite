define([
    'text!tmpl/item.html',
    'map/map',
    'module',
], function(Tmpl, Map, module) {

var ItemView = Backbone.View.extend({

    tagName: "div",

    className: "search-result",

    events: {
        mouseenter: "mouseenter",
        mouseleave: "mouseleave",
        "click .zoom": "zoom"
    },

    initialize: function(options) {

        this.template = _.template(Tmpl);
        this.listenTo(this.model, "change", this.render);

    },

    render: function() {

        var data = this.model.toJSON();
        data.site_root = module.config().site_root;

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

    zoom: function(ev) {

        ev.preventDefault();

        Map.zoomToLayer(this.model);

    }

});

return ItemView;

});