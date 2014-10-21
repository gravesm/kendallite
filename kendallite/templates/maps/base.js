var bing_key = 'AkFIrXPDm0XaKbLTi4eP46yoxo_bjbnGp9KOjqB_t7lclaNgMAl6EzoLtXsC2smS',
    map, extent, box, baselayers, tmpl;

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

map = new ol.Map({
    target: "map",
    layers: [baselayers]
});

box = new ol.format.WKT().readFeature('{{ layer.wkt }}');
extent = box.getGeometry().getExtent();

extent[1] = extent[1] < -85.06 ? -85.06 : extent[1];
extent[3] = extent[3] > 85.06 ? 85.06 : extent[3];

extent = ol.proj.transformExtent(extent, "EPSG:4326", "EPSG:3857");
map.getView().fitExtent(extent, map.getSize());

$("#zoom-to-layer").on("click", function(ev) {
    ev.preventDefault();
    map.zoomToExtent(box.getBounds());
});

tmpl = _.template($("#layer-switcher").html());
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

$("h3").on("click", function() {
    $(this).toggleClass('expanded');
    $(this).next("section").toggle();
}).next("section").toggle();
