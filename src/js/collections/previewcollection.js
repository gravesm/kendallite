define([
    'backbone',
    'models/item'
], function(Backbone, Item) {

var Previewed = Backbone.Collection.extend({

    model: Item

});

return new Previewed();

});