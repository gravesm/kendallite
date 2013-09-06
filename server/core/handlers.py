from tornado.web import RequestHandler, asynchronous
from tornado.httpclient import AsyncHTTPClient
from request import NegotiatedRequestHandler, authenticated, negotiate
from conf import settings

class WFSHandler(RequestHandler):

    def get_current_user(self):
        pass

    @asynchronous
    def get(self):
        http = AsyncHTTPClient()

        query = self.request.query

        # fetch access level from Solr
        server = self.unrestricted_wfs()

        url = "{0}?{1}".format(server, query)

        http.fetch(url, callback=self.proxy_response)

    def proxy_response(self, response):
        self.write(response.body)
        self.finish()

    @authenticated
    def restricted_wfs(self):
        return settings.WFS_SECURE_URL

    def unrestricted_wfs(self):
        return settings.WFS_URL


class LayerMetadataHandler(NegotiatedRequestHandler):

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
