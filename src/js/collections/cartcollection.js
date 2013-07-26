define([
    'backbone',
    'models/item'
], function(Backbone, Item) {

var Cart = Backbone.Collection.extend({

    model: Item

});

return new Cart();

});