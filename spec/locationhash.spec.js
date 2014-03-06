define(['locationhash'], function(hash) {

    return describe("Locationhash", function() {
        var _hash, _set;

        beforeEach(function() {
            _hash = spyOn(hash, "_hash");
            _set = spyOn(hash, "set");
        });

        describe("params", function() {
            it("returns hash as object of key value pairs", function() {
                _hash.andReturn("cinder=ella&little=red");
                expect(hash.params()).toEqual({
                    cinder: ['ella'],
                    little: ['red']
                });
            });

            it("combines repeated params into one array", function() {
                _hash.andReturn("muffin=cup&muffin=cake");
                expect(hash.params()).toEqual({muffin: ['cup', 'cake']});
            });
        });

        describe("update", function() {
            it("adds object to current hash params", function() {
                _hash.andReturn("weeble=wobble");
                hash.update({crumble: "foot"});
                expect(hash.set).toHaveBeenCalledWith({
                    weeble: ['wobble'], crumble: ['foot']
                });
            });

            it("overwrite existing params by default", function() {
                _hash.andReturn("name=buttercup");
                hash.update({name: 'muffincup'});
                expect(hash.set).toHaveBeenCalledWith({name: ['muffincup']});
            });

            it("appends to existing params when specified", function() {
                _hash.andReturn("peerage=Lady Cupcake");
                hash.update({peerage: "Sir Topham Hate"}, true);
                expect(hash.set).toHaveBeenCalledWith({
                    peerage: ['Lady Cupcake', 'Sir Topham Hate']
                });
            });
        });

        describe("remove", function() {
            it("removes a value from a param", function() {
                _hash.andReturn("beeble=bobble&beeble=wobble");
                hash.remove("beeble", "wobble");
                expect(hash.set).toHaveBeenCalledWith({beeble: ['bobble']});
            });
        });

        describe("get", function() {
            it("gets value of a param", function() {
                _hash.andReturn("tootsie=pup");
                expect(hash.get("tootsie")).toBe("pup");
            });

            it("gets value of param with multiple values as array", function() {
                _hash.andReturn("build=bow&build=bear");
                expect(hash.get("build")).toEqual(['bow', 'bear']);
            });
        });
    });

});