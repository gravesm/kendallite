
define([
    'jquery',
    'underscore',
    'backbone',
    'tmpl/template',
    'models/user',
    'map/map',
    'collections/previewcollection',
    'collections/cartcollection',
    'appconfig',
    'text!tmpl/FGDC_V2_a.xsl'
], function($, _, Backbone, Template, user, Map, Previewed, Cart, Config, XSL) {

var ItemView = Backbone.View.extend({

    tagName: "div",

    events: {
        mouseenter: "mouseenter",
        mouseleave: "mouseleave",
        "change input": "preview",
        "click .ogp-control-zoom": "zoom",
        "click .ogp-control-information": "showInfo",
        "click .ogp-cart-add": "addToCart",
        "click .ogp-cart-remove": "removeFromCart",
        "click .ogp-preview-remove": "removeFromPreviewed"
    },

    initialize: function(options) {
        this.template = Template(options.template) || Template("search");
        this.listenTo(this.model, "change", this.render);
        this.listenTo(this.model, "remove", this.itemRemoved);
    },

    addToCart: function() {

        this.model.set("incart", true);
        Cart.add(this.model);

    },

    removeFromCart: function() {

        this.model.set("incart", false);
        Cart.remove(this.model);

    },

    removeFromPreviewed: function() {

        this.model.set("previewed", false);
        Previewed.remove(this.model);

    },

    render: function() {

        var data = this.model.toJSON();

        try {
            data.location = $.parseJSON(data.Location);
        } catch (e) {
            data.location = {};
        }

        this.$el.html( this.template( _.extend(data, user) ) );

        return this;

    },

    mouseenter: function(ev) {

        this.$el.addClass("result-highlight");

        var l, b, r, t;

        l = this.model.get("MinX");
        b = this.model.get("MinY");
        r = this.model.get("MaxX");
        t = this.model.get("MaxY");

        Map.addPreviewBox([l,b,r,t]);

    },

    mouseleave: function(ev) {

        this.$el.removeClass("result-highlight");

        Map.removePreviewBoxes();

    },

    itemRemoved: function() {
        Map.removePreviewBoxes();
    },

    preview: function(ev) {

        if ($(ev.currentTarget).is(":checked")) {
            this.model.set("previewed", true);
            Previewed.add(this.model);
        } else {
            this.model.set("previewed", false);
            Previewed.remove(this.model);
        }

    },

    zoom: function() {

        /**
         * @todo Need to stick this model somewhere so it appears at top of
         *       results.
         */

        Map.zoomToLayer(this.model);

    },

    showInfo: function() {

        var data = {
            q: "LayerId:\"" + this.model.id + "\"",
            wt: "json",
            fl: "FgdcText"
        };

        var res = $.getJSON(Config.ogp.solr + "select/", data);

        res.done(function(data) {
            var xml = $.parseXML(data.response.docs[0].FgdcText);
            var xsl = $.parseXML(XSL);
            var t;

            if (xml.transformNode) {
                t = xml.transformNode(xsl);
            } else {
                var proc = new XSLTProcessor();
                proc.importStylesheet(xsl);
                t = proc.transformToFragment(xml, document);
            }

            $("#ogp-dialog-fgdc").html(t).dialog({
                width: 600,
                height: 500,
                buttons: {
                    Close: function() {
                        $(this).dialog("close");
                    }
                }
            });

        });

    }

});

return ItemView;

});