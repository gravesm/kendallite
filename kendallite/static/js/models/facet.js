define(function() {

return Backbone.Model.extend({

    initialize: function() {
        this.items = new Backbone.Collection();

        /**
         * Sorts items in a facet by selected first.
         */
        this.items.comparator = function(item1, item2) {
            var s_1 = item1.get("selected");
            var s_2 = item2.get("selected");

            if (s_1 == s_2) {
                return 0;
            }

            if (s_1) {
                return -1;
            }

            return 1;
        };
    },

    sync: function() {}

});

});