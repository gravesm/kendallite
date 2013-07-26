
define([
    "underscore",
    "text!tmpl/cart.html",
    "text!tmpl/search.html",
    "text!tmpl/previewed.html",
    "text!tmpl/partials/cart_icon.html",
    "text!tmpl/partials/preview.html",
    "text!tmpl/partials/download_email.html"
], function(_, Cart, Search, Previewed, CartIcon, Preview, Email) {

_.templateSettings.variable = "d";

var templates = {
    cart: _.template(Cart),
    search: _.template(Search),
    preview: _.template(Previewed)
};

var partials = {
    cart_icon: _.template(CartIcon),
    preview: _.template(Preview),
    email: _.template(Email)
};

var Template = function(tmpl) {

    var template_f = templates[tmpl];

    if (typeof template_f === "undefined") {
        return undefined;
    }

    var render = function(data) {

        _.extend(data, {
            partial: function(part) {

                var partial_f = partials[part];

                return partial_f(data);
            }
        });

        return template_f(data);
    };

    return render;
};

return Template;

});