
define([
    'backbone',
    'collections/resultscollection',
    'collections/facetscollection',
    'solr/requestqueue',
    'solr/solr',
    'solr/ogprequest',
    'models/query'
], function(Backbone, Results, Facets, RQ, Solr, OGP, Query) {

/**
 * Handles search events.
 */
var SearchController = Backbone.View.extend({

    initialize: function() {

        this.req = new RQ(300);
        this.listenTo(Query, "change", this.search);

    },

    /**
     * Triggers a Solr search and replaces the contents of the results
     * collection.
     */
    search: function() {

        var geosearch, q;

        $(".results-mask").show();

        geosearch = new OGP({
            bounds: Query.get("bounds"),
            terms: Query.get("keyword"),
            datatypes: Query.get("DataTypeSort"),
            institutions: Query.get("InstitutionSort"),
            places: Query.get("PlaceKeywordsSort"),
            dates: Query.get("ContentDate")
        });

        q = geosearch.getSearchParams();

        q.start = Query.get("start") || 0;

        this.req.queueRequest(
            new Solr(q)
        ).done(function(data) {

            Query.set({
                    total: data.total,
                    start: data.start
                }, {
                    silent: true
            });

            Results.reset();
            Results.add(data.results);
            Facets.reset(data.facets);

            $(".results-mask").hide();

        });

    }

});

return new SearchController();

});