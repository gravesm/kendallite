var previewlayer = new ol.source.Vector();

previewlayer.addFeature(new ol.Feature({
    geometry: new ol.geom.Polygon([[
        [extent[0], extent[1]],
        [extent[2], extent[1]],
        [extent[2], extent[3]],
        [extent[0], extent[3]],
        [extent[0], extent[1]]
    ]])
}));

map.addLayer(new ol.layer.Vector({
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
}));
