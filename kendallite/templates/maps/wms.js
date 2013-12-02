var wms_layer = new OpenLayers.Layer.WMS('{{ layer.name }}', [ {{ wms }} ], {
        layers: '{{ layer.layer_name }}',
        format: "image/png",
        tiled: true,
        exceptions: "application/vnd.ogc.se_inxml",
        transparent: true
    }, {
        transitionEffect: "resize",
        opacity: 1
    }
);

wms_layer.events.register("loadstart", wms_layer, function() {
    $(".map-overlay").show().animate({
        opacity: 0.5
    }, 300);
});

wms_layer.events.register("loadend", wms_layer, function() {
    $(".map-overlay").animate({
        opacity: 0
    }, 300, function() {
        $(this).hide();
    });
});

map.addLayer(wms_layer);