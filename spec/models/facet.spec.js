define(['models/facet'], function(Facet) {

    return describe("Facet", function() {

        var facet;

        beforeEach(function() {
            facet = new Facet();
        });

        it("creates an empty collection as items property", function() {
            facet.items.add({name: 'muffincup'});
            expect(facet.items.shift().get('name')).toEqual('muffincup');
        });

        it("sorts items with selected property first", function() {
            facet.items.add({name: 'buttercup', selected: true});
            facet.items.add({name: 'muffincup'});
            facet.items.add({name: 'cupcake', selected: true});
            facet.items.sort();
            expect(facet.items.shift().get('name')).toEqual('buttercup');
            expect(facet.items.shift().get('name')).toEqual('cupcake');
            expect(facet.items.shift().get('name')).toEqual('muffincup');
        });

    });

});