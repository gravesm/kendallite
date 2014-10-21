define([
    'vendor/text!tmpl/layer_switcher.html',
], function(Tmpl) {

var Map = function() {
    var bing_key = 'AkFIrXPDm0XaKbLTi4eP46yoxo_bjbnGp9KOjqB_t7lclaNgMAl6EzoLtXsC2smS',
        previewlayer, map;

    this.initialize = function(options) {
        var opts, center, extent, tmpl, baselayers;

        previewlayer = new ol.layer.Vector({
            title: 'Preview Layer',
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(195,130,45,0.5)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(195,130,45,0.8)',
                    width: 2
                })
            })
        });

        baselayers = new ol.layer.Group({
            layers: [
                new ol.layer.Tile({
                    title: 'OpenStreetMap',
                    source: new ol.source.OSM(),
                    preload: Infinity
                }),
                new ol.layer.Tile({
                    title: 'Roads',
                    source: new ol.source.BingMaps({
                        key: bing_key,
                        imagerySet: 'Road'
                    }),
                    visible: false
                }),
                new ol.layer.Tile({
                    title: 'Aerial',
                    source: new ol.source.BingMaps({
                        key: bing_key,
                        imagerySet: 'Aerial'
                    }),
                    visible: false
                }),
                new ol.layer.Tile({
                    title: 'Aerial with Labels',
                    source: new ol.source.BingMaps({
                        key: bing_key,
                        imagerySet: 'AerialWithLabels'
                    }),
                    visible: false
                })
            ]
        });

        opts = {
            target: "map",
            layers: [baselayers, previewlayer]
        };

        _.extend(opts, options);

        map = new ol.Map(opts);

        if (opts.b && opts.z) {
            extent = _.map(opts.b.split(","), function(num) {
                return parseFloat(num, 10);
            });
            extent = ol.proj.transformExtent(extent, "EPSG:4326", "EPSG:3857");
            map.setView(new ol.View({
                center: ol.extent.getCenter(extent),
                zoom: opts.z
            }));
        } else {
            map.setView(new ol.View({
                center: ol.proj.transform([-105, 40], "EPSG:4326", "EPSG:3857"),
                zoom: 3
            }));
        }

        /**
         * Generate layer switcher
         */
        tmpl = _.template(Tmpl);

        baselayers.getLayers().forEach(function(layer) {
            $(".map-layers").append(tmpl({ 'title': layer.get('title') }));
        });

        $(".map-layers").on("click", "a", function(ev) {
            var layerid = $(this).data('layerid');
            ev.preventDefault();
            baselayers.getLayers().forEach(function(layer) {
                if (layer.get("title") === layerid) {
                    layer.setVisible(true);
                } else {
                    layer.setVisible(false);
                }
            });
        });

        $("#zoom-max").on("click", function() {
            map.setView(new ol.View({
                center: ol.proj.transform([0,0], "EPSG:4326", "EPSG:3857"),
                zoom: 1
            }));
        });

    };

    /**
     * Adds a simple vector box to the map. Used for showing extent of a layer.
     *
     * @param {Array} box [left, bottom, right, top]
     */
    this.addPreviewBox = function(box) {
        var bbox, extent;

        box[1] = box[1] < -85.06 ? -85.06 : box[1];
        box[3] = box[3] > 85.06 ? 85.06 : box[3];

        extent = ol.proj.transformExtent(box, "EPSG:4326", "EPSG:3857");

        bbox = new ol.Feature({
            geometry: new ol.geom.Polygon([[
                [extent[0], extent[1]],
                [extent[2], extent[1]],
                [extent[2], extent[3]],
                [extent[0], extent[3]],
                [extent[0], extent[1]]
            ]])
        });

        previewlayer.getSource().clear();
        previewlayer.getSource().addFeature(bbox);
    };

    this.removePreviewBoxes = function() {
        previewlayer.getSource().clear();
    };

    this.map = function() {
        return map;
    };

};

return new Map();

});