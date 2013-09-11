from tornado.web import RequestHandler
from tornado.httpclient import AsyncHTTPClient
from tornado import gen
from core.request import NegotiatedRequestHandler, authenticated, negotiate
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


class LayerMetadataHandler(NegotiatedRequestHandler):

    def initialize(self):
        self.solr = pysolr.Solr(settings.SOLR_URL)

    @negotiate
    def get(self, layerid):
        # fetch FGDC data from Solr
        pass


def fgdc_xml(request, response):
    request.set_header("Content-type", "text/xml; charset=utf-8")
    request.write(response)
    request.finish()


def fgdc_html(request, response):
    request.set_header("Content-type", "text/html; charset=utf-8")
    request.write(response)
    request.finish()
