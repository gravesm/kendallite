define([
    'text!tmpl/facetitem.html',
    'models/query'
], function(Tmpl, Query) {

return Backbone.View.extend({

    tagName: "div",

    className: "checkbox",

    events: {
        "change input": "select"
    },

    initialize: function() {
        this.template = _.template(Tmpl);
    },

    render: function() {

        var data = this.model.toJSON();

        data.facet = this.options.facet;

        this.$el.html( this.template(data) );

        return this;
    },

    select: function(ev) {

        var value, name, items;

        value = this.model.get('value');
        name = this.options.facet;
        items = Query.get(name) || [];

        if ( $(ev.currentTarget).is(":checked") ) {
            Query.set( name, _.union(items, [value]) );
        } else {
            Query.set( name, _.difference(items, [value]) );
        }

    }

});

});