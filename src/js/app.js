
define([
    'jquery',
    'underscore',
    'backbone',
    'controllers/searchcontroller',
    'map/map',
    'appconfig',
    'models/query',
    'controllers/logincontroller',
    'controllers/resultscontroller',
    'controllers/facetscontroller'
], function($, _, Backbone, SearchController, Map, Config, Query) {

var App = Backbone.View.extend({

    el: $("body"),

    events: {
        "submit #search-form": "setKeyword",
        "submit #geocode": "geocode",
        "click #pagination a": "setPage",
        "click .previous a": "previousPage",
        "click .next a": "nextPage"
    },

    initialize: function() {

        var mapEvents = {
            "moveend": _.bind(this.setBounds, this)
        };

        Map.initialize({
            eventListeners: mapEvents
        });
    },

    nextPage: function(ev) {

        ev.preventDefault();

        $(".results-mask").show();

        var start = Query.get("start") || 0;

        Query.set("start", start + Config.results.windowsize);

    },

    previousPage: function(ev) {

        ev.preventDefault();

        $(".results-mask").show();

        var start = Query.get("start");

        Query.set("start", start - Config.results.windowsize);

    },

    setKeyword: function(ev) {

        ev.preventDefault();

        var keyword = $(ev.currentTarget).find("input[name='keyword']").val();

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

        function resizeResults() {

            /**
             * Maximum height of search results div.
             */
            var resultsHeight =
                $(window).height() -
                $(".search-results").offset().top -
                30
            ;

            var innerHeight = resultsHeight - (resultsHeight % 30);

            Config.results.windowsize = innerHeight / 30;

            $(".search-results").css("max-height", innerHeight + "px");

        }

        resizeResults();

        $(window).on("resize", resizeResults);

        $("#search").hover(
            function() {
                $(".search-nav").fadeTo(200, 0.95);
            },
            function() {
                $(".search-nav").fadeTo(200, 0.0);
            }
        );

        $("#filters-button").on("click", function() {

            $("#filters").toggle(300, resizeResults);

            return false;

        });

        $(".right-btn").on("click", "a", function(ev) {
            ev.preventDefault();

            $("#layers-box").css({
                opacity: 0.0,
                visibility: "visible"
            }).fadeTo(200, 1.0);

        });

        return new App();

    }
};

});
