#!/usr/bin/env python

import tornado.ioloop
from tornado.web import Application
from kendallite.conf import settings

if __name__ == "__main__":

    routes = settings.URLS

    application = Application(routes.urls, debug=True, template_path='ogp/templates/',
        static_path='ogp/static')

    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
