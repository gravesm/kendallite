define(function() {

var Map = function() {
    var previewlayer, map;

    this.initialize = function(options) {
        var opts, center, extent;

        previewlayer = new ol.source.Vector();

        opts = {
            target: "map",
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                }),
                new ol.layer.Vector({
                    source: previewlayer,
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(195,130,45,0.5)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(195,130,45,0.8)',
                            width: 2
                        })
                    })
                })
            ]
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

        previewlayer.clear();
        previewlayer.addFeature(bbox);
    };

    this.removePreviewBoxes = function() {
        previewlayer.clear();
    };

    this.map = function() {
        return map;
    };

};

return new Map();

});