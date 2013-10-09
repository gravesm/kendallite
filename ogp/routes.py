from handlers import (WFSHandler, LayerMetadataHandler,)

urls = [
    (r'/wfs', WFSHandler),
    (r'/layer/([^/]+)/?', LayerMetadataHandler),
]
