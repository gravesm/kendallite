
require([
    'jquery',
    'app',
    'jquery-ui'
], function($, App) {

$(function() {

    $("#tabs").tabs();

    App.run();

});

});
