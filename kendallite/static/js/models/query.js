define(['locationhash'], function(Hash) {

/**
 * The Query model stores the current state of the Solr query.
 */
var Query = Backbone.Model.extend({

    defaults: {
        boosts: {
            area: 0,
            center: 5.0,
            intx: 1.0,
            name: 1.0,
            publisher: 1.0,
            originator: 1.0,
            place_keywords: 2.5
        }
    },

    initialize: function() {
        this.on("change:qs", function(m, v) {
            m.set('qs', this._toInt(v));
        });
        this.on("change:geofilter", function(m, v) {
            m.set('geofilter', this._toBool(v));
        });
        this.on("change:restricted", function(m, v) {
            m.set('restricted', this._toBool(v));
        });
    },

    params: function() {

        var bounds, boosts, q, filters = [];

            bounds = this._toBounds(this.get('b'));
            boosts = this.get('boosts');
            q = _.first(this.get('q')) || "*";

            filters.push(this.dataTypeFilter());
            filters.push(this.institutionFilter());
            filters.push(this.placeKeywordFilter());
            filters.push(this.dateFilter());
            filters.push(this.restrictedFilter(this.get("restricted")));
            filters.push(this.spatialFilter(this.get("geofilter")));

        return {
            qf: this.queryFields(boosts),
            q: q,
            bf: this.boostFunctions(boosts, bounds),
            fq: _.compact(filters),
            intx: this.intersection(bounds),
            union: this.union(bounds)
        };

    },

    boostFunctions: function(boosts, bounds) {

        var bf = [];

        !boosts.area || bf.push(this.areaRelevancy(bounds) + "^" + boosts.area);
        !boosts.center || bf.push(this.centerRelevancy(bounds) + "^" + boosts.center);
        !boosts.intx || bf.push("div($intx,$union)^" + boosts.intx);

        return bf;

    },

    queryFields: function(boosts) {

        var qf = [];

        !boosts.name || qf.push("LayerDisplayName^" + boosts.name);
        !boosts.place_keywords || qf.push("PlaceKeywords^" + boosts.place_keywords);
        !boosts.publisher || qf.push("Publisher^" + boosts.publisher);
        !boosts.originator || qf.push("Originator^" + boosts.originator);

        return qf.join(" ");

    },

    spatialFilter: function(geofilt) {
        return geofilt ? '{!frange l=0 incl=false}$intx' : undefined;
    },

    restrictedFilter: function(restricted) {
        return restricted ? '!(Access:"Restricted" AND !(InstitutionSort:"MIT"))': undefined;
    },

    dataTypeFilter: function(datatypes) {

        var dt;

        if (typeof datatypes === "undefined") {
            return;
        }

        dt = _.map(_.flatten([datatypes]), function(v) { return '"' + v + '"'; });

        return '{!tag=dt}DataTypeSort:(' + dt.join(" OR ") + ')';

    },

    institutionFilter: function(institutions) {

        var inst;

        if (typeof institutions === "undefined") {
            return;
        }

        inst = _.map(_.flatten([institutions]), function(v) { return '"' + v + '"'; });

        return '{!tag=inst}InstitutionSort:(' + inst.join(" OR ") + ')';

    },

    placeKeywordFilter: function(keywords) {

        var pl;

        if (typeof keywords === "undefined") {
            return;
        }

        pl = _.map(_.flatten([keywords]), function(v) { return '"' + v + '"'; });

        return '{!tag=pl}PlaceKeywordsSort:(' + pl.join(" AND ") + ')';

    },

    dateFilter: function(dates) {

        var df;

        if (typeof dates === "undefined") {
            return;
        }

        df = _.map(_.flatten([dates]), function(v) {
            if (v === "before") {
                return "[* TO 1900-01-01T01:01:01Z-1SECOND]";
            } else {
                return "[" + v + " TO " + v + "+10YEAR-1SECOND]";
            }
        });

        return '{!tag=df}ContentDate:(' + df.join(" OR ") + ')';

    },

    intersection: function(b) {

        var intersection;

        intersection = "product(max(0,sub(min("+b.right+",MaxX),max("+b.left+",MinX))),";
        intersection += "max(0,sub(min("+b.top+",MaxY),max("+b.bottom+",MinY))))";

        return intersection;

    },

    union: function(b) {

        var bounds = b.toGeometry().getArea();

        return "sub(sum(" + bounds + ",Area),$intx)";

    },

    centerRelevancy: function(b) {

        var score,
            center = b.getCenterLonLat();

        score = "if(and(exists(CenterX),exists(CenterY)),";
        score += "recip(sqedist(CenterX,CenterY,"+center.lon+","+center.lat+"),1,1000,1000),0)";

        return score;

    },

    areaRelevancy: function(b) {

        var map = b.toGeometry().getArea();

        return "if(exists(Area),recip(abs(sub(Area," + map + ")),1,100,100),0)";

    },

    sync: function() {
        var attributes = _.extend({}, this.defaults, Hash.params());
        this.clear({silent: true});
        this.set(attributes);
        this.trigger('sync', this);
    },

    _toInt: function(v) {
        if (_.isArray(v)) {
            return parseInt(v[0]);
        } else {
            return parseInt(v);
        }
    },

    _toBool: function(v) {
        if (!_.isBoolean(v)) {
            if (_.isArray(v)) {
                return v[0] === 'true';
            } else {
                return v === 'true';
            }
        } else {
            return v;
        }
    },

    _toBounds: function(bounds) {
        if (bounds) {
            return new OpenLayers.Bounds(bounds[0].split(","));
        } else {
            return new OpenLayers.Bounds(-180, -90, 180, 90);
        }
    }

});

return new Query();

});