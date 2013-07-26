
define([
    'jquery',
    'underscore',
    'backbone',
    'controllers/searchcontroller',
    'map/map',
    'appconfig',
    'models/query',
    'controllers/previewcontroller',
    'controllers/cartcontroller',
    'controllers/logincontroller',
    'controllers/resultscontroller',
    'controllers/facetscontroller'
], function($, _, Backbone, SearchController, Map, Config, Query, PreviewController) {

var App = Backbone.View.extend({

    el: $("body"),

    events: {
        "submit #search": "setKeyword",
        "submit #geocode": "geocode",
        "click #pagination a": "setPage",
        "click #solr-config button": _.bind(SearchController.search, SearchController),
        "click #previewedbox": _.bind(PreviewController.show, PreviewController)
    },

    initialize: function() {

        var mapEvents = {
            "moveend": _.bind(this.setBounds, this)
        };

        Map.initialize({
            eventListeners: mapEvents
        });
    },

    setKeyword: function(ev) {

        ev.preventDefault();

        var keyword = $(ev.currentTarget).find("input[name='s.keyword']").val();

        Query.set({
            start: 0,
            keyword: keyword
        });

    },

    setBounds: function() {

        var map, bounds;

        map = Map.getMap();

        bounds = map.getExtent().transform("EPSG:900913", "EPSG:4326");

        Query.set({
            start: 0,
            bounds: bounds
        });

    },

    setPage: function(ev) {

        ev.preventDefault();

        var start = Query.get("start") || 0;

        Query.set("start", start + 20);

    },

    geocode: function(ev) {

        var place, geocoder;

        ev.preventDefault();

        place = $(ev.currentTarget).find("input[name='s.geolocate']").val();

        geocoder = new google.maps.Geocoder();

        geocoder.geocode({
            address: place
        }, function(result, status) {

            var bounds, vp;

            vp = result[0].geometry.viewport;

            bounds = new OpenLayers.Bounds([
                vp.getSouthWest().lng(),
                vp.getSouthWest().lat(),
                vp.getNorthEast().lng(),
                vp.getNorthEast().lat()
            ]);

            bounds.transform("EPSG:4326", "EPSG:900913");

            Map.getMap().zoomToExtent(bounds);

        });
    }

});




/**
 * Adds a method to Backbone collections that sets the attributes en masse for
 * one or more models identified by a list of ids.
 *
 * @param  {Array}  ids   List of model ids
 * @param  {Object} attrs Attributes to change
 */
Backbone.Collection.prototype.setWhereIds = function(ids, attrs) {

    var cids = $.isArray(ids) ? ids : [ids];

    _.each(cids, function(id) {

        var item = this.get(id);

        if (item) {
            item.set(attrs);
        }

    }, this);

};

return {
    run: function() {

        $("#solr-config").on("click", function() {
            $("#solr-config-dialog").dialog({
                buttons: {
                    Update: function() {

                        $(this).find("input[type='text']").each(function() {
                            var value = $(this).val();
                            var name = $(this).attr("name");

                            if (!isNaN(parseFloat(value))) {
                                Config.solr[name] = parseFloat(value);
                            }
                        });

                        SearchController.search.call(SearchController);
                    }
                }
            });
        });

        $("#ogp-facets-wrap").on("click", ".facet-collapse", function() {

            $("#ogp-facets-wrap").animate({
                width: "30px"
            }, {
                duration: 200,
                queue: false
            });
            $("#ogp-facets").toggle(400);
            $(".facet-collapse, .facet-expand").toggle();
            return false;
        }).on("click", ".facet-expand", function() {
            $("#ogp-facets-wrap").animate({
                width: "40%"
            }, {
                duration: 200,
                queue: false
            });
            $("#ogp-facets").toggle(100);
            $(".facet-collapse, .facet-expand").toggle();
            return false;
        });

        return new App();
    }
};

});
