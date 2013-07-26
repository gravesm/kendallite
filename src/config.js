var require = {

    paths: {
        'jquery': 'libs/jquery-1.9.1.min',
        'jquery-ui': 'libs/jquery-ui-1.10.2.custom.min',
        'underscore': 'libs/underscore-min',
        'backbone': 'libs/backbone-min',
        'text': 'libs/text'
    },

    shim: {
        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: "Backbone"
        },
        'underscore': {
            exports: "_"
        },
        'jquery-ui': ['jquery']
    },

    urlArgs: "bust=" + (new Date()).getTime()

};