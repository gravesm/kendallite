define([
    'vendor/text!tmpl/pagination.html',
    'locationhash'
], function(tmpl, hash) {

var PaginationView = Backbone.View.extend({

    el: $("#pagination"),

    events: {
        "click a": "select"
    },

    initialize: function(opts) {
        this.template = _.template(tmpl);
        this.pagesize = opts.pagesize;
    },

    render: function(opts) {
        var total, current, previous;

        current = Math.ceil((opts.start + 1) / this.pagesize);
        total = Math.ceil(opts.total / this.pagesize);

        this.$el.html(this.template({
            first: (current - 2 > 1) ? 1 : undefined,
            last: (current + 2 < total) ? total: undefined,
            previous: (current > 1) ? (current - 1) : undefined,
            next: (current < total) ? (current + 1) : undefined,
            pages: _.range(Math.max(1, current - 2), Math.min(total, current + 2) + 1),
            current: current
        }));

        return this;
    },

    select: function(ev) {
        var start;
        ev.preventDefault();

        start = ($(ev.currentTarget).data("page") - 1) * this.pagesize;
        hash.update({qs: start});
    }
});

return PaginationView;

});