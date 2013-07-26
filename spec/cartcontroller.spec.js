
define([
    'jquery',
    'backbone',
    "controllers/cartcontroller",
    "collections/cartcollection"
], function($, Backbone, Controller, Cart) {

    return describe("CartController", function() {

        beforeEach(function() {

            spyOn(Controller, "renderView");

            Controller.$cart = $("<div/>");

        });

        afterEach(function() {
            Cart.reset();
        });

        it("updates the DOM with current Cart contents", function() {

            var model = new Backbone.Model();

            Cart.add(model);

            expect(Controller.renderView.calls.length).toBe(1);

            Cart.remove(model);

            Cart.add(model);

            expect(Controller.renderView.calls.length).toBe(2);

        });

    });

});