from tornado.web import RequestHandler, HTTPError
from tornado.httpclient import AsyncHTTPClient
from tornado import gen
from kendallite.core import transformer
from lxml import etree
from ogp.layer import Layer
from ogp import settings


class BaseHandler(RequestHandler):
    """Base handler inherited by all other handlers. This sets the current_user
    property on the request if the user is authenticated."""

    def get_current_user(self):
        return self.request.headers.get('Remote_user')


class MainHandler(BaseHandler):
    """Generates search page"""

    def get(self):

        kwargs = {
            'user': self.current_user,
            'login_url': settings.SHIB_LOGIN_URL,
        }

        self.render('index.html', **kwargs)


class WFSHandler(BaseHandler):
    """Proxies requests to non-restricted WFS services"""

    @gen.coroutine
    def get(self):

        http = AsyncHTTPClient()

        layer = yield Layer.get(self.get_argument('OGPID'))

        if layer.is_restricted:
            raise HTTPError(403)

        url = "{0}?{1}".format(layer.location['wfs'], self.request.query)

        response = yield http.fetch(url)

        self.write(response.body)
        self.finish()


class LayerMetadataHandler(BaseHandler):
    """Generates individual layer page"""

    @gen.coroutine
    def get(self, layerid):

        layer = yield Layer.get(layerid)

        authorized = False

        if (self.current_user and layer.institution.lower() == "mit") or not layer.is_restricted:
                authorized = True

        kwargs = {
            'layer': layer,
            'user': self.current_user,
            'authorized': authorized,
        }

        if layer.is_vector or layer.is_raster:

            if layer.is_vector:
                template = 'vector.html'
            else:
                template = 'raster.html'

            html = self._transform(layer.fgdc, transformer.fgdc_transform)

            kwargs['fgdc'] = html

        else:
            template = 'nongeo.html'

        self.render(template, **kwargs)

    def _transform(self, xml, transform):
        root = etree.XML(xml.strip().encode('utf-8'))
        return transform(root)
