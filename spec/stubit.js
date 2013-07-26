/**
 * This module allows you to inject test stubs into the module loading process
 * during jasmine unit testing.
 */
define(["underscore"], function(_) {

    var uid = 0;

    function defineMock(mockid, mock) {
        define(mockid, function() {
            return mock;
        });
    }

    function Stubit() {

        var i, ctx, locals, context, mock, mocks, config,
            loaded = false;

        config = _.clone(requirejs.s.contexts._.config);

        uid++;

        context = {
            context: "teststub" + uid,
            map: {
                "*": {}
            }
        };

        mocks = Array.prototype.slice.call(arguments);

        for (i=0; i<mocks.length; i++) {

            if (_.isArray(mocks[i][1])) {
                mock = jasmine.createSpyObj.apply(this, mocks[i]);
            } else {
                mock = mocks[i][1];
            }

            mockname = mocks[i][0];

            defineMock(mockname+uid, mock);

            context.map["*"][mockname] = mockname+uid;

        }

        ctx = requirejs.config(_.extend(config, context));

        return function(modules, spec) {

            runs(function() {

                ctx(modules, function() {
                    locals = Array.prototype.slice.call(arguments);
                    loaded = true;
                });

            });

            waitsFor(function() {
                return loaded;
            });

            runs(function() {
                spec.apply(this, locals);
            });

        };

    }

    return Stubit;

});
