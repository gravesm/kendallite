from handlers import (WFSHandler, LayerMetadataHandler, MainHandler)

urls = [
    (r'/wfs', WFSHandler),
    (r'/layer/([^/]+)/?', LayerMetadataHandler),
    (r'/', MainHandler),
]
