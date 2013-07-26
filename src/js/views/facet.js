
define([
    'jquery',
    'underscore',
    'backbone',
    'text!tmpl/facet.html',
    'models/query'
], function($, _, Backbone, FacetTmpl, Query) {

_.templateSettings.variable = "d";

var FacetView = Backbone.View.extend({

    tagName: "div",

    events: {
        "change input": "select"
    },

    initialize: function() {

        this.template = _.template(FacetTmpl);

    },

    render: function() {
        var data = this.model.toJSON();

        data.query = Query.get(this.model.get("name"));

        this.$el.html( this.template( data ) );

        return this;
    },

    /**
     * Updates the Query model when user selects/unselects a facet item.
     */
    select: function(ev) {

        var $this = $(ev.currentTarget);

        var name = $this.attr("name").replace(/\[\]$/, '');

        var arr = Query.get(name);

        if (!$.isArray(arr)) {
            arr = [];
        }

        /**
         * This is necessary to ensure that the model change event
         * fires consistently.
         */
        var copy = arr.slice();

        if ($this.is(":checked")) {
            copy.push($this.val());
        } else {
            copy = _.without(copy, $this.val());
        }

        Query.set(name, _.uniq(copy), {silent: true});
        Query.set("start", 0, {silent: true});
        Query.trigger("change");

    }

});

return FacetView;

});