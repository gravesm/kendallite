define([
    'backbone',
    'models/item'
], function(Backbone, Item) {

return Backbone.Collection.extend({

    model: Item

});

});