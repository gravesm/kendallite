var wms_source = new ol.source.TileWMS({
    urls: {{ layer.wms_urls }},
    params: {
        LAYERS: '{{ layer.harvard_layer_name or layer.layer_name }}',
        FORMAT: 'image/png'
    },
    serverType: 'geoserver'
});

var wms_layer = new ol.layer.Tile({
    source: wms_source
});

map.addLayer(wms_layer);

$("#opacity").slider().on("slide", function(ev) {
    wms_layer.setOpacity($(this).val() / 100);
});