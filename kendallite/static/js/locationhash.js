define(function() {

    var Hash = function() {

        /**
         * Sets the location hash to the value of obj.
         *
         * @param {Object}  obj Parameters to set hash to.
         */
        this.set = function(obj) {
            window.location.hash = $.param(obj, true).replace(/\+/g, '%20');
        };

        this.get = function(key) {
            var params = this.params();
            if (_.isArray(params[key])) {
                if (params[key].length > 1) {
                    return params[key];
                } else {
                    return params[key][0];
                }
            }
        };

        this.remove = function(key, value) {
            var params = this.params();
            if (_.isArray(params[key])) {
                params[key] = _.difference(params[key], _.flatten([value]));
            }

            this.set(params);
        };

        this.update = function(obj, append) {

            var params = this.params();

            _.each(obj, function(val, key) {
                if (append) {
                    params[key] = _.union(params[key] || [], _.flatten([val]));
                } else {
                    params[key] = _.flatten([val]);
                }
            });

            this.set(params);

        };

        /**
         * Turns location hash into an object of key/value pairs.
         *
         * @return {Object} Since any particular key may appear more than once,
         *                  all values are returned as an array.
         */
        this.params = function() {

            var hash, params = {};

            hash = this._hash();

            if (hash) {
                _.each(hash.split('&'), function(part) {
                    var p = part.split("="),
                        k = p[0],
                        v = p[1];

                    if (params[k] !== undefined) {
                        params[k].push(decodeURIComponent(v));
                    } else {
                        params[k] = [decodeURIComponent(v)];
                    }
                });
            }

            return params;
        };

        this._hash = function() {
            return location.hash.slice(1);
        };

    };

    return new Hash();

});