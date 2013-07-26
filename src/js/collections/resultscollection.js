
define([
    'backbone',
    'models/item'
], function(Backbone, Item) {

var Results = Backbone.Collection.extend({

    model: Item

});

return new Results();

});