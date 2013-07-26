define([
    'underscore',
    'backbone',
    'collections/previewcollection',
    'map/map',
    'views/item'
], function(_, Backbone, Previewed, Map, ItemView) {

/**
 * The PreviewController manages previewed WMS layers on the map.
 */
var PreviewController = Backbone.View.extend({

    el: $("#ogp-dialog-previewed"),

    events: {
        "click .ogp-control-wfs": "toggleWFS",
        "click .ogp-control-wfs-active": "toggleWFS"
    },

    initialize: function() {

        this.listenTo(Previewed, "add", this.addLayer);
        this.listenTo(Previewed, "remove", this.removeLayer);
        this.listenTo(Previewed, "reset", this.removeAll);

    },

    show: function() {

        this.refresh();

        this.$el.dialog({
            width: 450,
            buttons: {
                "Clear all previewed": _.bind(this.empty, this),
                "Close": function() {
                    $(this).dialog("close");
                }
            }
        });
    },

    empty: function() {
        Previewed.reset();
    },

    refresh: function() {
        this.$el.empty();
        Previewed.each(this.renderView, this);
        $("#previewedbox").text("Previewed Layers (" + Previewed.length + ")");
    },

    addLayer: function(layer) {

        this.refresh();
        Map.addWMSLayer(layer);

    },

    removeLayer: function(layer) {

        this.refresh();
        if (Previewed.length === 0) {
            this.$el.dialog("close");
        }
        Map.removeWMSLayer(layer);

    },

    removeAll: function(collection, opts) {

        _.each(opts.previousModels, function(model) {
            model.set("previewed", false);
            Map.removeWMSLayer(model);
        }, this);

        this.refresh();

        this.$el.dialog("close");

    },

    renderView: function(item) {

        var view = new ItemView({
            model: item,
            template: "preview"
        });

        var row = view.render().el;

        $(row).find(".ogp-control-opacity").slider({
            min: 0,
            max: 100,
            value: item.get("wmsOpacity") || 100,
            slide: function(ev, ui) {
                Map.changeOpacity(item, ui.value / 100);
            },
            stop: function(ev, ui) {
                item.set("wmsOpacity", ui.value, {silent: true});
            }
        });

        this.$el.append(row);

    },

    /**
     * Toggles WFS control for this layer.
     * @return {[type]} [description]
     */
    toggleWFS: function(ev) {

        var id = $(ev.currentTarget)
            .parents(".ogp-layer")
            .attr("data-layerid")
        ;

        var layer = Previewed.get(id);

        var wfs_active = layer.get("wfsIsActive");

        _.each(Previewed.where({wfsIsActive: true}), function(item) {
            item.set("wfsIsActive", false);
        });

        layer.set("wfsIsActive", !wfs_active);

        Map.resetWFSControl();

        if (!wfs_active) {
            Map.activateWFSControl(layer);
        }

    }

});

return new PreviewController();

});