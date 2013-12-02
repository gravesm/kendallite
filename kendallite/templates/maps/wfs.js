var wfs_control, wfs_tmpl;

wfs_control = new OpenLayers.Control.WMSGetFeatureInfo({
    url: '{{ wfs }}',
    layerUrls: [ {{ wms }} ],
    infoFormat: 'application/vnd.ogc.gml',
    vendorParams: {
        OGPID: '{{ layer.id }}'
    }
});

wfs_tmpl = _.template($("#feature-tmpl").html());

wfs_control.events.register("getfeatureinfo", this, function(ev) {
    $("#features-content").empty();
    _.each(ev.features, function(feature) {
        $("#features-content").append(wfs_tmpl(feature));
    });
    $("#features-dialog").modal();
});

map.addControl(wfs_control);

wfs_control.activate();