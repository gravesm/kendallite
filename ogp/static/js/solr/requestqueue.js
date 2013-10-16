/**
 * Copyright 2013 MIT Libraries.
 */
(function(root, factory) {
    if (typeof exports === "object") {
        module.exports = factory(require("jquery"));
    } else if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else {
        root.RequestQueue = factory(jQuery);
    }
}(this, function($) {

    /**
     * Creates an instance of RequestQueue. This is designed to manage an
     * environment where one type of event might repeatedly generate many
     * asynchronous tasks but only the most recent task needs to be run. This
     * could be useful in handling situations such as find as you type searches.
     * 
     * @param {number} timeout Frontloaded delay in ms before a task will be
     *                         run. If another task comes in before the previous
     *                         task's timeout happens, the previous task will be
     *                         discarded and the new one created with a reset
     *                         timer.
     */
    var RequestQueue = function(timeout) {
        
        var queued, request, pointer, dfd;

        this.delay = timeout || 0;

        if (!(this instanceof RequestQueue)) {
            return new RequestQueue(timeout);
        }

        /**
         * Starts the timer for a request. At the end of the timeout the request
         * will run unless another request has been queued.
         *
         * @public
         * @param  {object} req     A request object. This object should have a
         *                          run method that accepts a jQuery deferred to
         *                          be resolved with the run method successfully
         *                          completes.
         * @param  {object} options An object of options to be passed to the
         *                          request's run method.
         * @return {object}         jQuery deferred object. An instance of a
         *                          RequestQueue object guarantees that when a
         *                          deferred returned by calling queueRequest is
         *                          resolved, it is the most recent request
         *                          queued by this instance.
         */
        this.queueRequest = function(req, options) {

            clearTimeout(queued);

            if (dfd && dfd.hasOwnProperty("reject"))
                dfd.reject();

            queued = setTimeout(function() {
                runRequest(req, options);
            }, this.delay);

            dfd = $.Deferred();

            return dfd;

        }

        /**
         * Calls the run method of the request.
         *
         * @private
         * @param  {object} req     A request object.
         * @param  {object} options An options object to be passed to the
         *                          request object.
         */
        function runRequest(req, options) {
            
            if (request && request.hasOwnProperty("reject"))
                request.reject();

            request = req.run(dfd, options);
            
        }
    }

    return RequestQueue;
    
}));