var map, box, layer_tmpl;

map = new OpenLayers.Map({
    div: "map",
    projection: "EPSG:900913"
});

map.addLayers([
    new OpenLayers.Layer.Google("Google Streets", {
        numZoomLevels: 20
    }),
    new OpenLayers.Layer.Google("Google Physical", {
        type: google.maps.MapTypeId.TERRAIN
    }),
    new OpenLayers.Layer.Google("Google Hybrid", {
        type: google.maps.MapTypeId.HYBRID,
        numZoomLevels: 20
    }),
    new OpenLayers.Layer.Google("Google Satellite", {
        type: google.maps.MapTypeId.SATELLITE,
        numZoomLevels: 20
    })
]);

box = OpenLayers.Geometry.fromWKT('{{ layer.wkt }}');
box.transform("EPSG:4326", "EPSG:900913");
map.zoomToExtent(box.getBounds());

$("#zoom-to-layer").on("click", function(ev) {
    ev.preventDefault();
    map.zoomToExtent(box.getBounds());
});

layer_tmpl = _.template($("#layer-switcher").html());

_.each(map.layers, function(layer) {
    if (layer.isBaseLayer) {
        $(".map-layers").append(layer_tmpl(layer));
    }
});

$(".map-layers").on("click", "a", function(ev) {
    ev.preventDefault();
    map.setBaseLayer(map.getLayer($(this).data("layerid")));
});

$("h3").on("click", function() {
    $(this).toggleClass('expanded');
    $(this).next("section").toggle();
}).next("section").toggle();