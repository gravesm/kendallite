#!/usr/bin/env python

import tornado.ioloop
from tornado.web import Application
import os
import importlib # will need to install importlib from pypi for python < 2.7

if __name__ == "__main__":

    os.environ.setdefault("KENDALLITE_SETTINGS", "conf.settings")
    settings_module = os.environ['KENDALLITE_SETTINGS']

    settings = importlib.import_module(settings_module)
    routes = importlib.import_module(settings.URLS)

    application = Application(routes.urls, debug=True)

    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
