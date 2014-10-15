var map, extent, box;

map = new ol.Map({
    target: "map",
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ]
});

box = new ol.format.WKT().readFeature('{{ layer.wkt }}');
extent = box.getGeometry().getExtent();
extent = ol.proj.transformExtent(extent, "EPSG:4326", "EPSG:3857");
map.getView().fitExtent(extent, map.getSize());

$("#zoom-to-layer").on("click", function(ev) {
    ev.preventDefault();
    map.zoomToExtent(box.getBounds());
});

$("h3").on("click", function() {
    $(this).toggleClass('expanded');
    $(this).next("section").toggle();
}).next("section").toggle();
