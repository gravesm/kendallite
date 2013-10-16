define([
    'map/map',
    'models/query'
], function(Map, Query) {

    var Hash = function() {

        /**
         * Splits the URL hash into an object.
         *
         * @return {Object} Hash parameters and values
         */
        this.getHash = function() {
            var parts, hash,
                params = {};

            hash = location.hash.slice(1);

            if (!hash) {
                return false;
            }

            parts = hash.split("&");

            _.each(parts, function(part) {
                var param = part.split("=");
                params[param[0]] = decodeURIComponent(param[1]);
            });

            return params;

        };

        /**
         * Sets the URL hash to current query parameters.
         */
        this.update = function() {

            var attrs, datatype, institution;

            datatype = Query.get('DataTypeSort') || [];
            institution = Query.get('InstitutionSort') || [];

            attrs = {
                qs: Query.get('start') || 0,
                q: Query.get('keyword'),
                z: Map.map().getZoom(),
                b: Query.get('bounds'),
                dt: datatype.join(";"),
                is: institution.join(";")
            };

            location.hash = $.param(attrs);

        };
    };

    return new Hash();

});