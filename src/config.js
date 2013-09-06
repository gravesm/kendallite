var require = {

    paths: {
        'jquery': 'libs/jquery-1.9.1.min',
        'underscore': 'libs/underscore-min',
        'backbone': 'libs/backbone-min',
        'text': 'libs/text',
        'bootstrap': 'libs/bootstrap.min'
    },

    shim: {
        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: "Backbone"
        },
        'underscore': {
            exports: "_"
        },
        'bootstrap': {
            deps: ['jquery']
        }
    },

    urlArgs: "bust=" + (new Date()).getTime()

};