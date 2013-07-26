
define([
    "stubit",
    "backbone"
], function(Stubit, Backbone) {

    var RContoller, Results, Cart, Previewed, Query;

    return describe("ResultsController", function() {

        beforeEach(function() {

            load = Stubit(
                ['collections/resultscollection', new Backbone.Collection()],
                ['collections/cartcollection', new Backbone.Collection()],
                ['collections/previewcollection', new Backbone.Collection()],
                ['models/query', new Backbone.Model()]
            );

            load([
                'controllers/resultscontroller',
                'collections/resultscollection',
                'collections/cartcollection',
                'collections/previewcollection',
                'models/query'
            ], function(controller, results, cart, previewed, query) {
                RController = controller,
                Results = results,
                Cart = cart,
                Previewed = previewed,
                Query = query;
            });

        });

        describe("addResult method", function() {

            beforeEach(function() {
                RController.$el.empty();
                spyOn(RController, "renderView");
            });

            afterEach(function() {
                Results.reset();
            });

            it("adds pagination link", function() {

                Results.add(new Backbone.Model());

                expect(RController.$el.find("#pagination").length).toBe(1);

            });

            it("shows pagination link when there are more results", function() {

                Query.set({start: 0, total: 40});
                Results.add(new Backbone.Model());

                expect(RController.$el.find("#pagination").css("display"))
                    .not.toBe("none");

            });

            it("hides pagination link when there are no more results", function() {

                Query.set({start: 0, total: 10});
                Results.add(new Backbone.Model());

                expect(RController.$el.find("#pagination").css("display"))
                    .toBe("none");

            });

        });

        describe("addResult method", function() {

            beforeEach(function() {

                spyOn(RController, "renderView");

                Cart.add({id: "foo", name: "snarfbog"});

                Previewed.add({id: "baz", name: "pufflewip"});

                Results.add([
                    {id: "foo", name: "mugwomple"},
                    {id: "bar"},
                    {id: "baz"}
                ]);

            });

            afterEach(function() {
                Cart.reset();
                Results.reset();
                Previewed.reset();
            });

            it("replaces model instance with Cart model instance", function() {

                var foo = Results.get("foo");

                expect(foo.get("name")).toEqual("snarfbog");
                expect(Results.indexOf(foo)).toBe(0);

            });

            it("replaces model instance with Previewed model instance", function() {

                var baz = Results.get("baz");

                expect(baz.get("name")).toEqual("pufflewip");
                expect(Results.indexOf(baz)).toBe(2);

            });

        });

    });

});