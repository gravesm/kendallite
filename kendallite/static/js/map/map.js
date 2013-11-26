define([
    'text!tmpl/layer_switcher.html',
], function(Tmpl) {

var Map = function() {

    var previewlayer, map;

    this.initialize = function(options) {

        var opts, tmpl, center;

        opts = {
            div: "map",
            projection: "EPSG:900913",
            controls: [
                new OpenLayers.Control.Navigation({documentDrag: true}),
                new OpenLayers.Control.Zoom({
                    zoomInId: "zoom-in",
                    zoomOutId: "zoom-out"
                })
            ]
        };

        _.extend(opts, options);

        map = new OpenLayers.Map(opts);

        previewlayer = new OpenLayers.Layer.Vector("Preview Layer", {
            projection: "EPSG:4326"
        });

        map.addLayers([
            new OpenLayers.Layer.Google("Google Physical", {
                type: google.maps.MapTypeId.TERRAIN
            }),
            new OpenLayers.Layer.Google("Google Streets"),
            new OpenLayers.Layer.Google("Google Hybrid", {
                type: google.maps.MapTypeId.HYBRID
            }),
            new OpenLayers.Layer.Google("Google Satellite", {
                type: google.maps.MapTypeId.SATELLITE
            }),
            previewlayer
        ]);

        if (opts.bounds && opts.zoom) {
            center = new OpenLayers.Bounds(opts.bounds.split(",")).getCenterLonLat();
            center.transform("EPSG:4326", "EPSG:900913");
            map.setCenter(center, opts.zoom);
        } else {
            map.zoomToMaxExtent();
        }

        /**
         * Generate the layer switcher
         */
        tmpl = _.template(Tmpl);

        _.each(map.layers, function(layer) {
            if (layer.isBaseLayer) {
                $(".map-layers").append(tmpl(layer));
            }
        });

        $(".map-layers").on("click", "a", function(ev) {
            ev.preventDefault();
            map.setBaseLayer(map.getLayer($(this).data("layerid")));
        });

        /**
         * OL does not provide an easy way to set arbitrary divs as controls.
         * We'll have to hard code some things here.
         */
        $("#zoom-max").on("click", function() {
            map.setCenter([0,0]);
            map.zoomToMaxExtent();
        });

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

    this.map = function() {
        return map;
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