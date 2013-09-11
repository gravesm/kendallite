#!/usr/bin/env python

import tornado.ioloop
from tornado.web import Application
import os
import importlib # will need to install importlib from pypi for python < 2.7
import core.settings

if __name__ == "__main__":

    os.environ.setdefault("KENDALLITE_SETTINGS", "app.settings")
    settings_module = os.environ['KENDALLITE_SETTINGS']

    settings = importlib.import_module(settings_module)

    core.settings = settings

    routes = importlib.import_module(core.settings.URLS)
    engine = importlib.import_module(core.settings.STORAGE_ENGINE)

    core.settings.STORAGE_ENGINE = engine.ENGINE

    application = Application(routes.urls, debug=True)

    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
