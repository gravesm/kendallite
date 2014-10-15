map.on('singleclick', function(e) {
    var wfs_tmpl, url, wfs_url;

    wfs_tmpl = _.template($("#feature-tmpl").html());
    url = wms_source.getGetFeatureInfoUrl(e.coordinate,
        map.getView().getResolution(),
        "EPSG:3857", {
            INFO_FORMAT: "application/json",
            OGPID: '{{ layer.id }}'
        }
    );
    wfs_url = '{{ wfs }}' + '?' + url.split("?")[1];
    $.getJSON(wfs_url).done(function(data) {
        $("#features-content").empty();
        _.each(data.features, function(feature) {
            $("#features-content").append(wfs_tmpl(feature));
        });
        $("#features-dialog").modal();
    });
});
