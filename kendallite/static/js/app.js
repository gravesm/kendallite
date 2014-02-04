define([
    'controllers/resultscontroller',
    'controllers/facetscontroller',
    'models/facet',
    'models/item',
    'map',
    'module',
    'models/query',
    'reader',
    'locationhash'
], function(ResultsController, FacetView, Facet, Item, Map, module, query, reader, hash) {

_.templateSettings.variable = "o";

/**
 * Maintains the necessary state for rendering the results div.
 *
 * @property {number} windowsize Number of visible results
 */
var results_state = {
    windowsize: 0
};

/**
 * Main application view.
 */
var App = Backbone.View.extend({

    el: $("body"),

    events: {
        "submit #search-form": "setKeyword",
        "change input[name='limit']": "setGeofilter",
        "change input[name='restricted']": "setRestrictedFilter",
        "submit #geocode": "geocode",
        "click .page-left a": "previousPage",
        "click .page-right a": "nextPage"
    },

    initialize: function() {

        var search, map = Map.map();

        search = _.throttle(this._search, 100, {leading: false});

        this.results = new Backbone.Collection([], {
            model: Item
        });

        this.facets = new Backbone.Collection([], {
            model: Facet
        });

        Map.map().events.register("moveend", this, this.setBounds);

        $("#search-form input[name='keyword']").val(hash.get('q'));
        if (hash.get('geofilter')) {
            $("input[name='limit']").prop("checked", true);
        }

        if (hash.get('restricted')) {
            $("input[name='restricted']").prop("checked", true);
        }

        this.listenTo(query, "sync", search);
        this.listenTo(query, "change", this.updateFilterCount);
        query.fetch();

        $(window).on("hashchange", function() {
            var b,
                bounds = hash.get('b'),
                zoom = hash.get('z');

            query.fetch();

            if (bounds) {
                b = new OpenLayers.Bounds(bounds.split(","))
                            .transform("EPSG:4326", "EPSG:900913");
                Map.map().setCenter(b.getCenterLonLat(), zoom, true);
                map.getLayersByName("Preview Layer")[0].redraw();
            }
        });

        new ResultsController({
            collection: this.results,
            el: $("#results"),
            results: results_state
        });

        /* Set up facets. */
        this.facets.add(new Facet({name: "in"}));
        this.facets.add(new Facet({name: "dt"}));

        new FacetView({
            model: this.facets.findWhere({name: "in"}),
            el: $("#facet-institution"),
            dialog: $("#facet-institution-dialog")
        });

        new FacetView({
            model: this.facets.findWhere({name: "dt"}),
            el: $("#facet-datatype"),
            dialog: $("#facet-datatype-dialog")
        });

    },

    /**
     * Makes the Solr query and updates Backbone collections.
     *
     * This function should not be called directly, but should be throttled to
     * prevent unnecessary calls to Solr while panning and zooming the map.
     *
     * @private
     * @param  {Object} query Query model
     */
    _search: function(query) {
        var q, results, facets, params;

        $(".results-mask").show();

        results = this.results;
        facets = this.facets;

        q = query.qstring();
        q.start = parseInt(query.get('qs')) || 0;
        q.rows = results_state.windowsize || 15;

        params = $.extend({}, module.config().solr_defaults, q);

        $.ajax({
            url: module.config().solr + "select/",
            data: params,
            traditional: true,
            dataType: "json"
        }).done(function(data) {

            var res = reader.read(data);

            query.set({
                    total: res.total
                }, {
                    silent: true
            });

            results.reset(res.results);

            _.each(res.facets, function(facet) {
                var f = facets.findWhere({name: facet.name});

                if (f) {
                    f.items.reset(facet.counts);
                }
            });

            $(".results-mask").hide();
        });

    },

    /**
     * Go to the next page of search results.
     */
    nextPage: function(ev) {

        var start;

        ev.preventDefault();

        start = parseInt(query.get("qs")) || 0;

        if (start + results_state.windowsize >= query.get("total")) {
            return;
        }

        $(".results-mask").show();
        hash.update({qs: start + results_state.windowsize});

    },

    /**
     * Go to the previous page of search results.
     */
    previousPage: function(ev) {

        var start;

        ev.preventDefault();

        start = parseInt(query.get("qs"));

        if (start === 0) {
            return;
        }

        $(".results-mask").show();
        start = start - results_state.windowsize;
        start = (start < 0) ? 0 : start;
        hash.update({qs: start});

    },

    setGeofilter: function(ev) {
        hash.update({
            qs: 0,
            geofilter: $(ev.currentTarget).is(":checked")
        });
    },

    setRestrictedFilter: function(ev) {
        hash.update({
            qs: 0,
            restricted: $(ev.currentTarget).is(":checked")
        });
    },

    /**
     * Update the query's keyword value.
     *
     * Triggered when a user enters a new search term.
     */
    setKeyword: function(ev) {

        var keyword;

        ev.preventDefault();

        keyword = $(ev.currentTarget).find("input[name='keyword']").val();
        hash.update({
            qs: 0,
            q: keyword
        });

    },

    /**
     * Update the query's bounds value.
     *
     * Triggered when the map is moved.
     */
    setBounds: function() {

        var bounds;

        bounds = Map.map().getExtent().transform("EPSG:900913", "EPSG:4326");
        hash.update({
            qs: 0,
            b: bounds.toString(),
            z: Map.map().getZoom()
        });

    },

    /**
     * Updates the UI to show number of active filters.
     */
    updateFilterCount: function(query) {
        var count =
            (query.get("dt") || []).length +
            (query.get("in") || []).length;
        $("#active-filters").text('' + (count || ''));
    },

    /**
     * Move the map to provided location.
     */
    geocode: function(ev) {

        var place, geocoder;

        ev.preventDefault();

        place = $(ev.currentTarget).find("input[name='location']").val();

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

            Map.map().zoomToExtent(bounds);

        });
    }

});

return {
    run: function() {

        var href;

        /**
         * Resizes the search results div to fit in the window.
         */
        function resizeResults() {

            var resultsHeight, innerHeight,
                bottomMargin = 50, //margin between bottom of page and results
                rowHeight = 30; //height of result row

            resultsHeight =
                $(window).height() -
                $(".search-results").offset().top -
                bottomMargin
            ;

            innerHeight = resultsHeight - (resultsHeight % rowHeight);

            results_state.windowsize = innerHeight / rowHeight;

            $(".search-results").css("max-height", innerHeight + "px");

        }

        resizeResults();

        $(window).on("resize", resizeResults);

        $("#filters-button").on("click", function() {

            $(this).parent().toggleClass("open");
            $("#filters").toggle(0, resizeResults);

            return false;

        });

        $(".login-close").on("click", function() {
            $.cookie('kendallite_user', '');
        });

        if (typeof user === "undefined") {
            href = $(".login-shib").attr("href");
            $(".login-shib").attr(
                "href", href + encodeURIComponent(window.location.href)
            );
            $("#login-dialog").modal();
        }

        return new App();
    }
};

});
