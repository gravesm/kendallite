define(function() {

    var IndexReader = function() {};

    var methods = {

        read: function(data) {

            var facets = this.normalizeFacets(data.facet_counts);

            return {
                total: data.response.numFound,
                start: data.response.start,
                results: data.response.docs,
                facets: facets
            };

        },

        normalizeFacets: function(data) {

            var collection = [];

            _.each(data.facet_fields, function(counts, facetname) {

                var facet = {
                    name: facetname,
                    counts: this.prepareFieldCounts(counts)
                };

                collection.push(facet);

            }, this);

            _.each(data.facet_ranges, function(counts, facetname) {

                var facet = {
                    name: facetname,
                    counts: this.prepareDateCounts(counts)
                };

                collection.push(facet);

            }, this);

            return collection;

        },

        prepareFieldCounts: function(counts) {

            var terms = [];

            _.each(counts, function(item, idx, list) {

                if (idx % 2 === 0) {
                    terms.push({
                        value: item,
                        display: item,
                        count: list[idx+1]
                    });
                }

            });

            return terms;

        },

        prepareDateCounts: function(facet) {

            var dates = [];

            _.each(facet.counts, function(item, idx, list) {

                if (idx % 2 === 0) {
                    dates.push({
                        value: item,
                        display: item.slice(0,4) + "s",
                        count: list[idx+1]
                    });
                }

            });

            if (facet.before) {
                dates.unshift({
                    value: "before",
                    display: "Earlier",
                    count: facet.before
                });
            }

            return dates;
        }

    };

    IndexReader.prototype = methods;

    return new IndexReader();

});