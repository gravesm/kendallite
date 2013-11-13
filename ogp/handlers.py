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

    def authorized(self, layer):
        return (self.current_user and layer.institution.lower() == "mit") or not layer.is_restricted

    def reverse_url(self, name, *args):
        return settings.APPLICATION_ROOT + super(BaseHandler, self).reverse_url(name, *args)


class MainHandler(BaseHandler):
    """Generates search page"""

    def get(self):

        kwargs = {
            'user': self.current_user,
            'SOLR_URL': settings.SOLR_URL,
            'SITE_ROOT': settings.APPLICATION_ROOT,
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

        context = {
            'user': self.current_user,
            'authorized': self.authorized(layer),
            'login_url': settings.SHIB_LOGIN_URL,
        }

        if layer.is_vector:
            self._render_vector(layer, context)
        elif layer.is_raster:
            self._render_raster(layer, context)
        else:
            self.render('nongeo.html', layer=layer)

    def _render_vector(self, layer, ctx):
        if (layer.institution.lower() == "mit") and layer.is_restricted:
            wfs = layer.location['wfs']
        else:
            wfs = self.reverse_url('wfs')
        html = self._transform(layer.fgdc, transformer.fgdc_transform)
        self.render('vector.html', layer=layer, wfs=wfs, fgdc=html, **ctx)

    def _render_raster(self, layer, ctx):
        html = self._transform(layer.fgdc, transformer.fgdc_transform)
        self.render('raster.html', layer=layer, fgdc=html, **ctx)

    def _transform(self, xml, transform):
        root = etree.XML(xml.strip().encode('utf-8'))
        return transform(root)
