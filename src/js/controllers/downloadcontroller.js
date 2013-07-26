
define([
    'jquery',
    'underscore',
    'backbone',
    'collections/cartcollection',
    'models/user',
    'appconfig',
    'text!tmpl/download.html',
    'text!tmpl/partials/download_email.html'
], function($, _, Backbone, Cart, User, Config, Tmpl, EmailTmpl) {

_.templateSettings.variable = "d";

/**
 * The DownloadController manages interaction with the download dialog.
 */
var DownloadController = Backbone.View.extend({

    el: $("#ogp-dialog-download"),

    initialize: function() {

        this.template = _.template(Tmpl);

    },

    /**
     * Displays the download dialog.
     */
    show: function() {

        this.$el.empty();

        Cart.each(this.render, this);

        /**
         * @todo: we need a better way to handle this
         */
        if (Cart.findWhere({Institution: "Harvard"})) {
            this.$el.append(_.template(EmailTmpl, {}));
        }

        this.$el.dialog({
            width: 450,
            buttons: {
                "Download": _.bind(this.download, this),
                "Cancel": function() {
                    $(this).dialog("close");
                }
            }
        });
    },

    /**
     * Collects form data about the requested layers.
     */
    download: function() {
        var layers = [];

        this.$el.find("select").each(function() {

            var format = $(this).val(),
                layerid = $(this).attr("name");

            if (format === "skip") {
                return;
            }

            layers.push(layerid + "=" + format);
            Cart.setWhereIds(layerid, {downloadStatus: "downloading"});

        });

        if (layers.length) {

            this.initiateRequest({
                layers: layers,
                email: "",
                bbox: "180,-90,180,90"
            });
        }

        this.$el.dialog("close");

    },

    /**
     * Adds a rendered item to the download dialog.
     *
     * @param  {Backbone.Model} item Item to render
     * @return {Backbone.View}       This controller
     */
    render: function(item) {

        var data = item.toJSON();

        this.$el.append( this.template( _.extend(data, User) ) );

        return this;

    },

    /**
     * Makes the initial request to download layers.
     *
     * @param  {Object} opts Request params
     */
    initiateRequest: function(opts) {

        var layers = [];

        _.each(opts.layers, function(val) {
            layers.push(val.split("=").shift());
        });

        $.ajax({
                url: Config.ogp.root + "/requestDownload",
                context: this,
                dataType: "json",
                type: "POST",
                data: opts
            })
            .done(function(data) {
                if (data.requestId) {
                    this.pollDownload(data.requestId, layers);
                }
            })
            .fail(function() {
                Cart.setWhereIds(layers, {downloadStatus: "failed"});
            })
        ;

    },

    /**
     * Polls the server until download package is ready.
     *
     * @param  {String} reqId  Request ID
     * @param  {Array}  layers Array of layer IDs
     * @param  {Number} tries  Attempt number after failed request
     */
    pollDownload: function(reqId, layers, tries) {

        tries = tries || 0;

        $.ajax({
                url: Config.ogp.root + "/requestStatus",
                context: this,
                dataType: "json",
                data: {
                    requestIds: reqId
                }
            })
            .done(function(data) {

                /**
                 * @todo Is there ever a case where there would be multiple
                 *       requests in this response?
                 */
                if (data.requestStatus && data.requestStatus.length) {
                    var request = data.requestStatus[0];

                    if (request.status === "COMPLETE_SUCCEEDED") {
                        window.location.href = Config.ogp.root + "/getDownload?requestId=" + request.requestId;

                        Cart.setWhereIds(layers, {downloadStatus: "complete"});
                    } else if (request.status === "PROCESSING") {
                        setTimeout(_.bind(this.pollDownload, this, reqId, layers), 3000);
                    } else {
                        Cart.setWhereIds(layers, {downloadStatus: "failed"});
                    }
                }

            })
            .fail(function() {

                tries++;

                if (tries < 5) {
                    setTimeout(_.bind(this.pollDownload, this, reqId, layers, tries), 3000);
                } else {
                    Cart.setWhereIds(layers, {downloadStatus: "failed"});
                }

            })
        ;
    }

});

return new DownloadController();

});