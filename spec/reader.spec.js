define(['reader'], function(reader) {

    return describe("Solr index reader", function() {

        describe("read", function() {
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
        });

        describe("normalizeFacets", function() {

            var data = {
                facet_fields: {
                    frobbers: "frobnob",
                    whatnots: "wickleston"
                },
                facet_ranges: {
                    foodads: "foobar"
                }
            };

            beforeEach(function() {
                spyOn(reader, "prepareFieldCounts").andReturn("tacocat");
                spyOn(reader, "prepareDateCounts").andReturn("birdrib");
            });

            it("normalizes facets from Solr response", function() {
                expect(reader.normalizeFacets(data)).toEqual([
                    {name: "frobbers", counts: "tacocat"},
                    {name: "whatnots", counts: "tacocat"},
                    {name: "foodads", counts: "birdrib"}
                ]);
            });

            it("calls prepareFieldCounts with counts from each field", function() {
                reader.normalizeFacets(data);
                expect(reader.prepareFieldCounts).toHaveBeenCalledWith("frobnob");
                expect(reader.prepareFieldCounts).toHaveBeenCalledWith("wickleston");
            });

            it("calls prepareDateCounts with counts from each range", function() {
                reader.normalizeFacets(data);
                expect(reader.prepareDateCounts).toHaveBeenCalledWith("foobar");
            });
        });


        describe("prepareFieldCounts", function() {
            it("converts array of facet counts into array of objects", function() {
                var counts = ["foo", 1, "bar", 2, "baz", 3];

                expect(reader.prepareFieldCounts(counts)).toEqual([
                    {value: "foo", display: "foo", count: 1},
                    {value: "bar", display: "bar", count: 2},
                    {value: "baz", display: "baz", count: 3}
                ]);

            });
        });

        describe("prepareDateCounts", function() {
            var facet = {
                counts: ["1900-01-01", 4, "1910-01-01", 8],
                before: 200
            };

            it("converts array of range counts into array of objects", function() {
                var facets = reader.prepareDateCounts(facet);
                expect(facets).toContain(
                    {value: "1900-01-01", display: "1900s", count: 4}
                );
                expect(facets).toContain(
                    {value: "1910-01-01", display: "1910s", count: 8}
                );
            });

            it("adds an object for all counts before", function() {
                expect(reader.prepareDateCounts(facet)).toContain(
                    {value: "before", display: "Earlier", count: 200}
                );
            });
        });

    });

});