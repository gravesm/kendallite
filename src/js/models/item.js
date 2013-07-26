var Item;

define([
    'backbone',
    'underscore'
], function(Backbone, _) {

Item = Backbone.Model.extend({

    idAttribute: "LayerId",

    initialize: function(opts) {

        this.setDataTypes(opts.DataType);
        this.setFormatIcon(opts.DataType);
        this.setInstitutionIcon(opts.Institution);

    },

    /**
     * Sets two boolean properties on a layer: isVector and isRaster.
     */
    setDataTypes: function(datatype) {

        var dt,
            v_formats = ['point', 'line', 'polygon'],
            r_formats = ['raster', 'paper map'];

        if (typeof datatype === "string") {
            dt = datatype.toLowerCase();
            this.set("isVector", _.indexOf(v_formats, dt) !== -1);
            this.set("isRaster", _.indexOf(r_formats, dt) !== -1);
        }

    },

    setFormatIcon: function(datatype) {

        var dt;

        if (typeof datatype === "string") {

            dt = datatype.toLowerCase().replace(" ", "-");

            this.set("formatIcon", dt);

        }
    },

    setInstitutionIcon: function(institution) {

        var inst;

        if (typeof institution === "string") {

            inst = institution.toLowerCase().replace(" ", "-");

            this.set("institutionIcon", inst);

        }
    },

    sync: function() {}

});

return Item;

});