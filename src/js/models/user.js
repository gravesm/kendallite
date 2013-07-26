
define([
    'backbone'
], function(Backbone) {

var User = Backbone.Model.extend({

    isAuthenticated: function() {
        return !!this.get("authenticated");
    },

    sync: function() {}

});

return new User();

});