
define([
    "controllers/downloadcontroller",
    "collections/cartcollection",
    "models/item",
    "app",
    "jquery-ui"
], function(Controller, Cart, Item) {

    return describe("DownloadController", function() {

        var item;

        beforeEach(function() {

            spyOn(Controller, "render");
            item = new Item({LayerId: "foobar"});
            Cart.add(item, {silent: true});

        });

        afterEach(function() {
            Cart.reset(null, {silent: true});
        });

        describe("show method", function() {

            beforeEach(function() {
                Controller.show();
            });

            afterEach(function() {
                Controller.$el.dialog("destroy");
            });

            it("renders each item in cart", function() {

                expect(Controller.render.calls.length).toBe(1);

            });

            it("displays the dialog", function() {

                expect(Controller.$el.hasClass("ui-dialog-content")).toBe(true);

            });

        });

        describe("download method", function() {

            beforeEach(function() {

                spyOn(Controller, "initiateRequest");
                Controller.$el.append("<select name='foobar'><option value='shp' /></select>");
                Controller.$el.dialog();

                Controller.download();

            });

            afterEach(function() {

                Controller.$el.dialog("destroy");
                Controller.$el.empty();

            });

            it("should initiate a download request", function() {

                expect(Controller.initiateRequest).toHaveBeenCalled();

            });

            it("should set the downloading status", function() {

                expect(Cart.findWhere({downloadStatus: "downloading"})).toBeDefined();

            });

        });

    });

});