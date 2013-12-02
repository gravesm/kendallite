var preview_layer = new OpenLayers.Layer.Vector("Preview Layer", {
    projection: "ESPG:4326"
});

preview_layer.addFeatures([
    new OpenLayers.Feature.Vector(
        OpenLayers.Geometry.fromWKT('{{ layer.wkt }}').transform(
            'EPSG:4326', 'EPSG:900913'
        )
    )
]);

map.addLayer(preview_layer);