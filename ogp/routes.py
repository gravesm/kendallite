from handlers import (WFSHandler, LayerMetadataHandler, MainHandler)
from tornado.web import url

urls = [
    url(r'/wfs', WFSHandler, name="wfs"),
    (r'/layer/([^/]+)/?', LayerMetadataHandler),
    url(r'/', MainHandler, name="index"),
]
