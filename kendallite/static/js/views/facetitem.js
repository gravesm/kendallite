define([
    'text!tmpl/facetitem.html',
    'locationhash'
], function(Tmpl, hash) {

return Backbone.View.extend({

    tagName: "div",

    className: "checkbox",

    events: {
        "change input": "select"
    },

    initialize: function(opts) {
        this.options = opts;
        this.template = _.template(Tmpl);
    },

    render: function() {

        var data = this.model.toJSON();

        data.facet = this.options.facet;

        this.$el.html( this.template(data) );

        return this;
    },

    select: function(ev) {

        var value, name,
            params = {};

        value = this.model.get('value');
        name = this.options.facet;

        if ($(ev.currentTarget).is(":checked")) {
            params[name] = value;
            hash.update(params, true);
            hash.update({qs: 0});
        } else {
            hash.remove(name, value);
        }

    }

});

});