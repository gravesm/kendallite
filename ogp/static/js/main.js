require([
    'jquery',
    'app',
    'appconfig',
    'map/map',
    'locationhash',
    'bootstrap'
], function($, App, Config, Map, Hash) {

/**
 * Entry point for the application.
 *
 * This is the module loaded and executed first by RequireJS. It does some basic
 * UI setup and initializes the map, then starts up the Backbone framework.
 */
$(function() {

    var hash, opts;

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

        $("#filters").toggle(0, resizeResults);

        return false;

    });

    hash = Hash.getHash();
    opts = {};

    if (hash.b && hash.z) {
        opts['bounds'] = hash.b;
        opts['zoom'] = parseInt(hash.z);
    }

    Map.initialize(opts);

    App.run();

});

});
