from handlers import (WFSHandler, LayerMetadataHandler, fgdc_xml, fgdc_html)

urls = [
    (r'/wfs', WFSHandler),
    (r'/layer/([^/]+)/about/?', LayerMetadataHandler, dict(
        formatters={
            'text/xml': fgdc_xml,
            '*/*': fgdc_html,
        }
    )),
]
