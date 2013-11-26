define([
    'solr/reader'
], function(Reader) {

/**
 * @constructor
 * @param {object} params Solr params to added to the HTTP request
 * @param {object} opts   Any options to pass to constructor
 */
var Solr = function(params, opts) {
    this.params = params;
    this.opts = opts;
    this.reader = new Reader();
};

var methods = {

    /**
     * Makes the AJAX request.
     *
     * @private
     * @return {Object} jQuery deferred
     */
    doQuery: function() {

        var defaults, params;

        defaults = {
            wt: "json",
            q: "*:*",
            facet: true,
            "facet.field": [
                "{!ex=inst}InstitutionSort",
                "{!ex=dt}DataTypeSort",
                "PlaceKeywordsSort"
            ],
            "f.PlaceKeywordsSort.facet.mincount": 1,
            "f.PlaceKeywordsSort.facet.limit": 10,
            "facet.range": "{!ex=df}ContentDate",
            "facet.range.start": "1900-01-01T01:01:01Z",
            "facet.range.end": "NOW",
            "facet.range.gap": "+10YEAR",
            "facet.range.other": "before",
            sort: "score desc, LayerDisplayName asc",
            start: 0,
            defType: "edismax",
            fl: "Access,Area,CenterX,CenterY,DataType,DataTypeSort,HalfHeight,HalfWidth,Institution,InstitutionSort,LayerDisplayName,LayerId,Location,MaxX,MaxY,MinX,MinY,Name,WorkspaceName"
        };

        params = $.extend({}, defaults, this.params);

        return $.ajax({
            url: this.opts.solr + "select/",
            data: params,
            traditional: true
        });

    },

    /**
     * Runs the Solr query.
     *
     * @public
     * @param  {Object} dfd jQuery deferred
     * @return {Object}     jQuery deferred
     */
    run: function(dfd, context) {

        var ajax, read;

        ajax = this.doQuery();

        reader = this.reader;

        ajax.done(function(data) {
            dfd.resolveWith(context, [reader.read(data)]);
        });

        return ajax;
    }

};

Solr.prototype = methods;

return Solr;

});