require([
    'app',
    'map/map',
    'locationhash'
], function(App, Map, Hash) {

/**
 * Entry point for the application.
 */
$(function() {

    var hash, opts;

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
