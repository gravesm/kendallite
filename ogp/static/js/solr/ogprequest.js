define([
    'appconfig'
], function(Config) {

var OGPSolr = function(options) {
    this.options = options;
};

var methods = {

    /**
     * Builds an object of Solr request params.
     *
     * @public
     * @return {Object} Request params
     */
    getSearchParams: function() {

        var bbox, area, bf_array, qf_array, params;

        bbox = this.options.bounds;

        area = bbox.toGeometry().getArea();

        bf_array = [
            this.areaRelevancy(bbox) + "^" + Config.solr.areascore,
            this.centerRelevancy(bbox) + "^" + Config.solr.centerscore,
            "div($intx,$union)^" + Config.solr.intxscore
        ];

        qf_array = [
            "LayerDisplayName^"+Config.solr.LayerDisplayName,
            "Publisher^"+Config.solr.Publisher,
            "Originator^"+Config.solr.Originator,
            "Abstract^"+Config.solr.Abstract,
            "PlaceKeywords^"+Config.solr.PlaceKeywords
        ];

        params = {
            qf: qf_array.join(" "),
            q: this.options.terms || "*",
            bf: bf_array,
            fq: this.getFilters(),
            intx: this.intersection(bbox),
            union: area
        };

        return params;

    },

    /**
     * Return filter queries as array
     *
     * @private
     * @return {Array} Filter queries
     */
    getFilters: function() {

        var filters = [],
            bbox = this.options.bounds,
            datatypes = this.options.datatypes,
            institutions = this.options.institutions,
            places = this.options.places,
            dates = this.options.dates;

        if ($.isArray(datatypes) && datatypes.length) {
            filters.push(this.datatypeFilter(datatypes));
        }

        if ($.isArray(institutions) && institutions.length) {
            filters.push(this.institutionFilter(institutions));
        }

        if ($.isArray(places) && places.length) {
            filters.push(this.placesFilter(places));
        }

        if ($.isArray(dates) && dates.length) {
            filters.push(this.dateFilter(dates));
        }

        filters.push(this.geofilter(bbox));

        return filters;

    },

    /**
     * Creates a datatype filter.
     *
     * @private
     * @param  {Array}  datatypes Array of datatypes
     * @return {String}           Solr param string
     */
    datatypeFilter: function(datatypes) {

        var dt = datatypes.slice(0);

        _.each(dt, function(val, idx) {
            dt[idx] = '"' + val + '"';
        });

        return "{!tag=dt}DataTypeSort:(" + dt.join(" OR ") + ")";

    },

    /**
     * Creates an institution filter.
     *
     * @private
     * @param  {Array}  institutions Array of institutions
     * @return {String}              Solr param string
     */
    institutionFilter: function(institutions) {

        var inst = institutions.slice(0);

        _.each(inst, function(val, idx) {
            inst[idx] = '"' + val + '"';
        });

        return "{!tag=inst}InstitutionSort:(" + inst.join(" OR ") + ")";

    },

    /**
     * Creates a place keyword filter.
     *
     * @private
     * @param  {Array}  places Array of place keywords
     * @return {String}        Solr param string
     */
    placesFilter: function(places) {

        var plf, i,
            pl = places.slice(0);

        for (i=0; i<pl.length; i++) {
            pl[i] = "PlaceKeywordsSort:\"" + pl[i] + "\"";
        }

        plf = pl.join(" AND ");

        return "{!tag=pl}" + plf;

    },

    /**
     * Creates a date range filter.
     */
    dateFilter: function(dates) {

        var d = [];

        _.each(dates, function(date) {
            if (date === "before") {
                d.push("ContentDate:[* TO 1900-01-01T01:01:01Z-1SECOND]");
            } else {
                d.push("ContentDate:["+date+" TO "+date+"+10YEAR-1SECOND]");
            }
        });

        return "{!tag=df}" + d.join(" OR ");

    },

    /**
     * Query component to filter out non-intersecting layers.
     *
     * @private
     * @return {String} Query string filter
     */
    geofilter: function() {

        return "{!frange l=0 incl=false}$intx";

    },

    /**
     * Returns the intersection area of the layer and map.
     *
     * @private
     * @param  {OpenLayers.Bounds} bbox Bounds of the visible map
     * @return {String}                 Query string to calculate intersection
     */
    intersection: function(bbox) {

        var intersection, b = bbox;

        intersection = "product(max(0,sub(min("+b.right+",MaxX),max("+b.left+",MinX))),";
        intersection += "max(0,sub(min("+b.top+",MaxY),max("+b.bottom+",MinY))))";

        return intersection;

    },

    /**
     * Calculates the reciprocal of the squared Euclidean distance of the layer
     * center from the bounding box center.
     *
     * @private
     * @return {String}      Query string to calculate score for center distance
     */
    centerRelevancy: function(bounds) {

        var center, score;

        center = bounds.getCenterLonLat();

        score = "if(and(exists(CenterX),exists(CenterY)),";
        score += "recip(sqedist(CenterX,CenterY,"+center.lon+","+center.lat+"),1,1000,1000),0)";

        return score;

    },

    /**
     * Compares the area of the layer with the area of the visible bounding box.
     *
     * @private
     * @return {String}     Query string to calculate score for area comparison
     */
    areaRelevancy: function(bounds) {

        var map, area;

        map = bounds.toGeometry().getArea();

        area = "if(exists(Area),recip(abs(sub(Area," + map + ")),1,1000,1000),0)";

        return area;

    }

};

OGPSolr.prototype = methods;

return OGPSolr;

});