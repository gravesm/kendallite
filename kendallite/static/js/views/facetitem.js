define([
    'vendor/text!tmpl/facetitem.html',
    'locationhash'
], function(Tmpl, hash) {

return Backbone.View.extend({

    tagName: "li",

    events: {
        "click": "select"
    },

    initialize: function(opts) {
        this.template = _.template(Tmpl);
    },

    render: function() {
        var data = this.model.toJSON();

        this.$el.html( this.template(data) );
        return this;
    },

    select: function(ev) {
        var value, name,
            params = {};

        ev.preventDefault();

        value = this.model.get('value');
        name = this.model.get('f_id');

        if (this.model.get('selected') === true) {
            hash.remove(name, value);
        } else {
            params[name] = value;
            hash.update(params, true);
            hash.update({qs: 0});
        }

    }

});

});