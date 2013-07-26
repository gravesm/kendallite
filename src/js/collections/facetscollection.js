
define([
    'backbone',
    'models/facet'
], function(Backbone, Facet) {

var Facets = Backbone.Collection.extend({

    model: Facet

});

return new Facets();

});