define([
    'controllers/resultscontroller',
    'controllers/facetscontroller',
    'models/item',
    'models/query',
    'views/pagination',
    'map',
    'module',
    'reader',
    'locationhash'
], function(
    ResultsController,
    FacetController,
    Item,
    Query,
    Pagination,
    Map,
    module,
    reader,
    hash) {

_.templateSettings.variable = "o";

var pagesize = 15;

/**
 * Main application view.
 */
var App = Backbone.View.extend({

    el: $("body"),

    events: {
        "submit #search-form": "setKeyword",
        "change input[name='limit']": "setGeofilter",
        "change input[name='restricted']": "setRestrictedFilter",
        "submit #geocode": "geocode"
    },

    initialize: function() {
        var search,
            query = new Query(),
            map = Map.map();

        search = _.throttle(this._search, 100, {leading: false});

        this.results = new Backbone.Collection([], {
            model: Item
        });

        this.pagination = new Pagination({
            pagesize: pagesize
        });

        query = new Query();

        Map.map().events.register("moveend", this, this.setBounds);

        $("#search-form input[name='keyword']").val(hash.get('q'));
        if (hash.get('geofilter') === "true") {
            $("input[name='limit']").prop("checked", true);
        }

        if (hash.get('restricted') === "true") {
            $("input[name='restricted']").prop("checked", true);
        }

        this.listenTo(query, "sync", search);

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
            el: $("#results")
        });

        this.institutionFacet = new FacetController({
            el: $("#institutions"),
            collection: new Backbone.Collection(),
            facet_id: 'in'
        });

        this.datatypeFacet = new FacetController({
            el: $("#datatypes"),
            collection: new Backbone.Collection(),
            facet_id: 'dt'
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
        var q, results, params, pagination, institutions, datatypes;

        results = this.results;
        pagination = this.pagination;
        instutitions = this.institutionFacet;
        datatypes = this.datatypeFacet;

        q = query.params();
        q.start = query.get('qs') || 0;
        q.rows = pagesize;

        params = $.extend({}, module.config().solr_defaults, q);

        $.ajax({
            url: module.config().solr + "select/",
            data: params,
            traditional: true,
            dataType: "json"
        }).done(function(data) {

            var res = reader.read(data);

            results.reset(res.results);
            pagination.render({total: res.total, start: params.start});
            instutitions.collection.reset(reader.newRead(data.facet_counts.facet_fields.in));
            datatypes.collection.reset(reader.newRead(data.facet_counts.facet_fields.dt));

        });

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

        var keyword, bounds;

        ev.preventDefault();

        keyword = $(ev.currentTarget).find("input[name='keyword']").val();
        bounds = Map.map().getExtent().transform("EPSG:900913", "EPSG:4326");
        hash.update({
            qs: 0,
            q: keyword
        });

        $.get(module.config().stats_url, {
            action: "Search",
            note: keyword,
            extent: bounds.toString()
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

        $(".login-close").on("click", function() {
            $.cookie('kendallite_user', '');
        });

        /**
         * The global `user` variable will be undefined the first time a user
         * visits the site unless they have a valid Shib session. A defined but
         * empty `user` variable indicates an anonymous user.
         */
        if (typeof user === "undefined" || user === "") {
            href = $(".login-shib").attr("href");
            $(".login-shib").attr(
                "href", href + encodeURIComponent(window.location.href)
            );
        }

        if (typeof user === "undefined") {
            $("#login-dialog").modal();
        }

        return new App();
    }
};

});
