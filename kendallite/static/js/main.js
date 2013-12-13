require([
    'app',
    'map',
    'locationhash'
], function(App, Map, hash) {

/**
 * Entry point for the application.
 */
$(function() {

    var params, opts;

    Map.initialize({
        b: hash.get('b'),
        z: hash.get('z')
    });

    App.run();

});

});
