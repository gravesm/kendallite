var map;

define([
    'underscore',
    'jquery',
    'text!tmpl/wfs.html',
    'text!tmpl/layer_switcher.html',
    'appconfig'
], function(_, $, WFSTmpl, LayerSwitcherTmpl, Config) {

var Map = function() {

    var previewlayer, wfs_control;

    this.initialize = function(options) {

        var opts = {
            div: "map",
            projection: "EPSG:900913"
        };

        _.extend(opts, options);

        map = new OpenLayers.Map(opts);

        previewlayer = new OpenLayers.Layer.Vector("Preview Layer", {
            projection: "EPSG:4326"
        });

        wfs_control = new OpenLayers.Control.WMSGetFeatureInfo({
            url: Config.ogp.root + "/featureInfo"
        });

        wfs_control.events.register("getfeatureinfo", this, this.showFeature);

        map.addControl(wfs_control);

        var panel = new OpenLayers.Control.Panel({
            allowDepress: true
        });

        panel.addControls([
            new OpenLayers.Control.ZoomToMaxExtent()
        ]);

        map.addControl(panel);

        map.addLayers([
            new OpenLayers.Layer.Google("Google Layer"),
            new OpenLayers.Layer.Google("Google Physical", {
                type: google.maps.MapTypeId.TERRAIN
            }),
            previewlayer
        ]);

        map.zoomToMaxExtent();

        this.wfs_tmpl = _.template(WFSTmpl);

        var switcher_tmpl = _.template(LayerSwitcherTmpl);

        _.each(map.layers, function(layer) {
            if (layer.isBaseLayer) {
                $(".ogp-layer-switcher ul").append(switcher_tmpl(layer));
            }
        });

        $(".ogp-layer-switcher").on("click", "button", function() {
            $(".ogp-layer-switcher ul").slideToggle(200);
        });

        $(".ogp-layer-switcher").on("change", "input", function() {
            map.setBaseLayer(map.getLayer($(this).val()));
        });

    };

    this.layerSwitcher = function() {
    };

    /**
     * Adds a simple vector box to the map. Used for showing extent of a layer.
     *
     * @param {Array} box [left, bottom, right, top]
     */
    this.addPreviewBox = function(box) {
        var bbox, extent;

        bbox = new OpenLayers.Bounds(box).transform("EPSG:4326", "EPSG:900913");

        extent = new OpenLayers.Feature.Vector(bbox.toGeometry());

        previewlayer.removeAllFeatures();
        previewlayer.addFeatures([extent]);
    };

    this.removePreviewBoxes = function() {
        previewlayer.removeAllFeatures();
    };

    this.getMap = function() {
        return map;
    };

    /**
     * Adds a WMS layer to the map. Layers are added with an 'ogpLayerId'
     * property to make retrieving it from the map object easier.
     * @param {[type]} layer [description]
     */
    this.addWMSLayer = function(layer) {

        /**
         * First, check to see if the layer has been added to the map but set to
         * not visible.
         */
        var layerid = layer.get("LayerId");

        var layers = map.getLayersBy("ogpLayerId", layerid);

        if (layers.length > 0) {
            layers[0].setVisibility(true);
        } else {

            var title = layer.get("LayerDisplayName");
            /**
             * @todo: catch exceptions from JSON parsing
             */
            var url = $.parseJSON(layer.get("Location")).wms;

            if (layer.get("Access").toLowerCase() === "restricted") {
                url = ["/mitogp/restricted/wms"];
            }

            var wms = new OpenLayers.Layer.WMS(title, url, {
                    layers: layer.get("WorkspaceName") + ":" + layer.get("Name"),
                    format: "image/png",
                    tiled: true,
                    exceptions: "application/vnd.ogc.se_inxml",
                    transparent: true
                }, {
                    transitionEffect: "resize",
                    opacity: 1,
                    ogpLayerId: layer.get("LayerId")
                }
            );

            map.addLayer(wms);

        }
    };

    this.showFeature = function(ev) {

        if (typeof ev.features !== "undefined" && (ev.features.length > 0)) {
            /**
             * @todo Would we ever have more than one feature here?
             */
            $("#ogp-dialog-wfs")
                .html(this.wfs_tmpl(ev.features[0]))
                .dialog({
                    width: "auto",
                    height: "auto",
                    buttons: {
                        close: function() {
                            $(this).dialog("close");
                        }
                    }
                })
            ;
        }
    };

    /**
     * Removes a WMS layer from the map. Technically, layers aren't removed, the
     * visibility is just set to false.
     *
     * @todo : should this really remove a layer or just set visibility to false?
     * @param  {[type]} layerid [description]
     * @return {[type]}         [description]
     */
    this.removeWMSLayer = function(layer) {

        var layers = map.getLayersBy("ogpLayerId", layer.id);

        if (layers.length > 0) {
            layers[0].setVisibility(false);
        }

    };

    this.resetWFSControl = function() {
        wfs_control.deactivate();
    };

    /**
     * Current this only supports querying on one layer at a time.
     */
    this.activateWFSControl = function(model) {

        var wms = _.first( map.getLayersBy("ogpLayerId", model.id) );

        if (wms) {

            wfs_control.layers = [wms];
            wfs_control.layerUrls = wms.url;
            wfs_control.vendorParams = {
                OGPID: model.id
            };

            wfs_control.activate();

        }

    };

    this.changeOpacity = function(layer, level) {

        var layers = map.getLayersBy("ogpLayerId", layer.id);

        if (layers.length > 0) {
            layers[0].setOpacity(level);
        }

    };

    this.zoomToLayer = function(layer) {
        var l,b,r,t, bounds;

        l = layer.get("MinX");
        b = layer.get("MinY");
        r = layer.get("MaxX");
        t = layer.get("MaxY");

        bounds = new OpenLayers.Bounds([l,b,r,t]);
        bounds.transform("EPSG:4326", "EPSG:900913");

        map.zoomToExtent(bounds);

    };

};

return new Map();

});