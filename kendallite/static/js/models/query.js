define(['locationhash'], function(Hash) {

/**
 * The Query model stores the current state of the Solr query.
 */
var Query = Backbone.Model.extend({

    initialize: function() {
        this.on("change:qs", function(m, v) {
            m.set('qs', this.toInt(v));
        });
        this.on("change:geofilter", function(m, v) {
            m.set('geofilter', this.toBool(v));
        });
    },

    toInt: function(v) {
        if (_.isArray(v)) {
            return parseInt(v[0]);
        } else {
            return parseInt(v);
        }
    },

    toBool: function(v) {
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

    defaults: {
        boosts: {
            area: 1.0,
            center: 1.0,
            intx: 1.0,
            name: 1.0,
            publisher: 1.0,
            originator: 1.0,
            place_keywords: 2.5
        }
    },

    toBounds: function(bounds) {
        if (bounds) {
            return new OpenLayers.Bounds(bounds[0].split(","));
        } else {
            return new OpenLayers.Bounds(-180, -90, 180, 90);
        }
    },

    qstring: function() {

        var bf_array, qf_array, boosts;

        boosts = this.get('boosts');

        bf_array = [
            this.areaRelevancy() + "^" + boosts.area,
            this.centerRelevancy() + "^" + boosts.center,
            "div($intx,$union)^" + boosts.intx
        ];

        qf_array = [
            "LayerDisplayName^" + boosts.name,
            "Publisher^" + boosts.publisher,
            "Originator^" + boosts.originator,
            "PlaceKeywords^" + boosts.place_keywords
        ];

        return {
            qf: qf_array.join(" "),
            q: _.first(this.get('q')) || "*",
            bf: bf_array,
            fq: this.getFilters(),
            intx: this.intersection(),
            union: this.toBounds(this.get('b')).toGeometry().getArea()
        };

    },

    /**
     * Return filter queries as array
     *
     * @private
     * @return {Array} Filter queries
     */
    getFilters: function() {

        function wrap_terms(terms, wrapper) {
            if (terms) {
                return _.map(_.flatten([terms]), wrapper);
            }
        }

        function quote(v) {
            return '"' + v + '"';
        }

        function make_filter(terms, filter, conj) {
            if (terms) {
                return filter + "(" + terms.join(conj) + ")";
            }
        }

        var dt = wrap_terms(this.get('dt'), quote),
            is = wrap_terms(this.get('in'), quote),
            pl = wrap_terms(this.get('PlaceKeywordsSort'), quote),
            df = wrap_terms(this.get('ContentDate'), function range(v) {
                    if (v === "before") {
                        return "[* TO 1900-01-01T01:01:01Z-1SECOND]";
                    } else {
                        return "[" + v + " TO " + v + "+10YEAR-1SECOND]";
                    }
                }),
            gf = this.get('geofilter') ? '{!frange l=0 incl=false}$intx' : null;


        return _.compact([
            make_filter(dt, '{!tag=dt}DataTypeSort:', ' OR '),
            make_filter(is, '{!tag=inst}InstitutionSort:', ' OR '),
            make_filter(pl, '{!tag=pl}PlaceKeywordsSort:', ' AND '),
            make_filter(df, '{!tag=df}ContentDate:', ' OR '),
            gf
        ]);

    },

    intersection: function() {

        var intersection,
            b = this.toBounds(this.get('b'));

        intersection = "product(max(0,sub(min("+b.right+",MaxX),max("+b.left+",MinX))),";
        intersection += "max(0,sub(min("+b.top+",MaxY),max("+b.bottom+",MinY))))";

        return intersection;

    },

    centerRelevancy: function() {

        var score,
            center = this.toBounds(this.get('b')).getCenterLonLat();

        score = "if(and(exists(CenterX),exists(CenterY)),";
        score += "recip(sqedist(CenterX,CenterY,"+center.lon+","+center.lat+"),1,1000,1000),0)";

        return score;

    },

    areaRelevancy: function() {

        var map = this.toBounds(this.get('b')).toGeometry().getArea();

        return "if(exists(Area),recip(abs(sub(Area," + map + ")),1,1000,1000),0)";

    },

    sync: function() {
        var attributes = _.extend({}, this.defaults, Hash.params());
        this.clear({silent: true});
        this.set(attributes);
        this.trigger('sync', this);
    }

});

return new Query();

});