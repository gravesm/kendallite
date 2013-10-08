from tornado.web import RequestHandler
from tornado.httpclient import AsyncHTTPClient
from tornado import gen
from core.request import authenticated
from core import transformer
from lxml import etree
from app.layer import Layer
from app import settings

class WFSHandler(RequestHandler):

    def get_current_user(self):
        pass

    @gen.coroutine
    def get(self):
        ###
        # List of all access levels that should be considered public. Any level
        # encountered that is not in this list will be considered restricted.
        ###
        public_axs_lvls = ('public',)

        http = AsyncHTTPClient()

        layer = yield Layer.get(self.get_argument('OGPID'))

        if layer.access.lower() in map(str.lower, public_axs_lvls):
            server = layer.location['wfs']
        else:
            server = self.restricted_wfs()

        url = "{0}?{1}".format(server, self.request.query)

        response = yield http.fetch(url)

        self.write(response.body)
        self.finish()

    @authenticated
    def restricted_wfs(self):
        return settings.WFS_SECURE_URL


class LayerMetadataHandler(RequestHandler):

    @gen.coroutine
    def get(self, layerid):

        layer = yield Layer.get(layerid)

        if layer.is_vector or layer.is_raster:

            if layer.is_vector:
                template = 'vector.html'
            else:
                template = 'raster.html'

            html = self._transform(layer.fgdc, transformer.fgdc_transform)

            kwargs = {
                'layer': layer,
                'fgdc': html,
            }

        else:
            template = 'nongeo.html'

            kwargs = {
                'layer': layer
            }

        self.render(template, **kwargs)

    def _transform(self, xml, transform):
        root = etree.XML(xml.strip().encode('utf-8'))
        return transform(root)