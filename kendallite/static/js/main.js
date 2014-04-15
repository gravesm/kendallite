require([
    'app',
    'map',
    'locationhash'
], function(App, Map, hash) {

var re = /\B(?=(\d{3})+$)/g;

_.mixin({
    formatnumber: function(num) {
        return num.toString().replace(re, ",");
    }
});

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
