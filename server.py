#!/usr/bin/env python

import tornado.ioloop
from kendallite import Kendallite

if __name__ == "__main__":

    application = Kendallite()
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
