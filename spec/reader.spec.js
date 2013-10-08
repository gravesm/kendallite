define(['solr/reader'], function(Reader) {

    return describe("Solr index reader", function() {
        var reader;

        beforeEach(function() {
            reader = new Reader();
        });

        it("reads and returns cleaned up Solr response", function() {

            var resp, data;

            data = {
                response: {
                    numFound: 10,
                    start: 1,
                    docs: "foo"
                }
            };

            spyOn(reader, "normalizeFacets").andReturn("bar");

            resp = reader.read(data);

            expect(resp.total).toEqual(10);
            expect(resp.start).toEqual(1);
            expect(resp.results).toEqual("foo");
            expect(resp.facets).toEqual("bar");

        });

        it("normalizes facets from Solr response", function() {

            spyOn(reader, "prepareFieldCounts").andReturn("tacocat");
            spyOn(reader, "prepareDateCounts").andReturn("birdrib");

            var data = {
                facet_fields: {
                    frobbers: "frobnob",
                    whatnots: "wickleston"
                },
                facet_ranges: {
                    foodads: "foobar"
                }
            };

            expect(reader.normalizeFacets(data)).toEqual([
                {name: "frobbers", counts: "tacocat"},
                {name: "whatnots", counts: "tacocat"},
                {name: "foodads", counts: "birdrib"}
            ]);

        });

        it("prepares field counts", function() {

            var counts = ["foo", 1, "bar", 2, "baz", 3];

            expect(reader.prepareFieldCounts(counts)).toEqual([
                {value: "foo", display: "foo", count: 1},
                {value: "bar", display: "bar", count: 2},
                {value: "baz", display: "baz", count: 3}
            ]);

        });

        it("prepares date counts", function() {

            var facet = {
                counts: ["1900-01-01", 4, "1910-01-01", 8],
                before: 200
            };

            expect(reader.prepareDateCounts(facet)).toEqual([
                {value: "before", display: "Earlier", count: 200},
                {value: "1900-01-01", display: "1900s", count: 4},
                {value: "1910-01-01", display: "1910s", count: 8}
            ]);

        });

    });

});