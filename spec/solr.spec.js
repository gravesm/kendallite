define(['jquery', 'solr/solr'], function($, Solr) {

    return describe("Solr", function() {

        var solr, dfd;

        beforeEach(function() {
            dfd = $.Deferred();
            solr = new Solr();
            spyOn(solr.reader, "read");
            spyOn(solr, "doQuery").andReturn(dfd);
        });

        it("makes ajax request when run", function() {
            solr.run();
            expect(solr.doQuery).toHaveBeenCalledWith();
        });

        it("calls an index reader with ajax response", function() {
            var data = {
                data: "Monkeyshines"
            };
            solr.run($.Deferred());
            dfd.resolve(data);
            expect(solr.reader.read)
                .toHaveBeenCalledWith(data);
        });


    });

});