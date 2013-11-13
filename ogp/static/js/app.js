define([
    'collections/results',
    'controllers/resultscontroller',
    'collections/facets',
    'controllers/facetscontroller',
    'models/facet',
    'map/map',
    'module',
    'models/query',
    'locationhash',
    'solr/requestqueue',
    'solr/solr',
    'solr/ogprequest'
], function(Results, ResultsController, Facets, FacetView,
                Facet, Map, module, Query, Hash, RQ, Solr, OGP) {

_.templateSettings.variable = "o";

/**
 * Maintains the necessary state for rendering the results div.
 *
 * @property {number} windowsize Number of visible results
 */
var results_state = {
    windowsize: 0
};

var solr_url = module.config().solr;

/**
 * Main application view.
 */
var App = Backbone.View.extend({

    el: $("body"),

    events: {
        "submit #search-form": "setKeyword",
        "submit #geocode": "geocode",
        "click .previous a": "previousPage",
        "click .next a": "nextPage"
    },

    /**
     * Initializes the Backbone application. Mostly, this sets up event listeners
     * for the various parts of the UI.
     */
    initialize: function() {

        var hash, opts;

        this.results = new Results();
        this.facets = new Facets();
        this.req = new RQ(100);

        hash = Hash.getHash();

        Map.map().events.register("moveend", this, this.setBounds);

        if (hash.q) {
            Query.set("keyword", hash.q);
            $("#search-form input[name='keyword']").val(hash.q);
        }

        if (hash.qs) {
            Query.set("start", hash.qs);
        }

        if (hash.b) {
            Query.set("bounds", hash.b);
        } else {
            Query.set("bounds", "-180,-90,180,90");
        }

        if (hash.dt) {
            Query.set("DataTypeSort", hash.dt.split(";"));
        }

        if (hash.is) {
            Query.set("InstitutionSort", hash.is.split(";"));
        }

        this.listenTo(Query, "change", this.search);
        this.listenTo(Query, "change", Hash.update);

        /* Once the application state is initialized, trigger the search. */
        Query.trigger("change", Query);

        new ResultsController({
            collection: this.results,
            el: $("#results"),
            results: results_state
        });

        /* Set up facets. */
        this.facets.add(new Facet({name: "InstitutionSort"}));
        this.facets.add(new Facet({name: "DataTypeSort"}));

        new FacetView({
            model: this.facets.findWhere({name: "InstitutionSort"}),
            el: $("#facet-institution"),
            dialog: $("#facet-institution-dialog")
        });

        new FacetView({
            model: this.facets.findWhere({name: "DataTypeSort"}),
            el: $("#facet-datatype"),
            dialog: $("#facet-datatype-dialog")
        });

    },

    /**
     * Go to the next page of search results.
     */
    nextPage: function(ev) {

        var start;

        ev.preventDefault();

        $(".results-mask").show();

        start = Query.get("start") || 0;

        Query.set("start", start + results_state.windowsize);

    },

    /**
     * Go to the previous page of search results.
     */
    previousPage: function(ev) {

        var start;

        ev.preventDefault();

        $(".results-mask").show();

        start = Query.get("start");
        start = start - results_state.windowsize;
        start = (start < 0) ? 0 : start;

        Query.set("start", start);

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

        Query.set({
            start: 0,
            keyword: keyword
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

        Query.set({
            start: 0,
            bounds: bounds.toString()
        });

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
    },

    /**
     * Perform a new Solr search.
     *
     * When the search completes, the contents of the results and facets
     * collections are replaced, triggering a refresh of the interface.
     */
    search: function(query, opts) {

        var geosearch, q, results, facets;

        $(".results-mask").show();

        geosearch = new OGP({
            bounds: new OpenLayers.Bounds(query.get("bounds").split(",")),
            terms: query.get("keyword"),
            datatypes: query.get("DataTypeSort"),
            institutions: query.get("InstitutionSort"),
            places: query.get("PlaceKeywordsSort"),
            dates: query.get("ContentDate"),
            boosts: {
                area: 1.0,
                center: 1.0,
                intx: 1.0,
                name: 1.0,
                publisher: 1.0,
                originator: 1.0,
                place_keywords: 2.5
            }
        });

        q = geosearch.getSearchParams();

        q.start = query.get("start") || 0;
        q.rows = results_state.windowsize || 15;

        results = this.results;
        facets = this.facets;

        this.req.queueRequest(
            new Solr(q, {solr: solr_url}), this
        ).done(function(data) {

            query.set({
                    total: data.total,
                    start: data.start
                }, {
                    silent: true
            });

            results.reset(data.results);

            _.each(data.facets, function(facet) {
                var f = facets.findWhere({name: facet.name});

                if (f) {
                    f.items.reset(facet.counts);
                }
            });

            $(".results-mask").hide();

        });

    }

});

return {
    run: function() {
        /**
         * Resizes the search results div to fit in the window.
         */
        function resizeResults() {

            var resultsHeight, innerHeight;

            resultsHeight =
                $(window).height() -
                $(".search-results").offset().top -
                30
            ;

            innerHeight = resultsHeight - (resultsHeight % 30);

            results_state.windowsize = innerHeight / 30;

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

            $(this).parent().toggleClass("open");
            $("#filters").toggle(0, resizeResults);

            return false;

        });

        return new App();
    }
};

});
