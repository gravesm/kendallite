from tornado.httpclient import AsyncHTTPClient
from tornado.httputil import url_concat
import json
from tornado import gen
from kendallite.core import settings

class Solr(object):

    def __init__(self):
        self.url = settings.SOLR_URL

    def load_layer(self, layer, *args, **kwargs):

        response = args[0]

        res = json.loads(response)

        doc = res['response']['docs'][0]

        for k,v in layer._fields.items():
            if v.name in doc:
                setattr(layer, k, v.add_to_class(doc[v.name]))

    @gen.coroutine
    def get(self, cls, id):
        http = AsyncHTTPClient()

        fields = (
            'Access', 'Location', 'LayerDisplayName', 'FgdcText', 'PlaceKeywords',
            'ThemeKeywords', 'Institution', 'Name', 'WorkspaceName', 'LayerId',
            'MaxX', 'MaxY', 'MinX', 'MinY', 'DataType'
        )

        params = {
            'q': 'LayerId:{0}'.format(id),
            'wt': 'json',
            'fl': (',').join(fields),
            'rows': 1
        }
        url = "{0}/select/".format(self.url.rstrip("/"))
        response = yield http.fetch(url_concat(url, params))

        layer = cls(response.body)

        raise gen.Return(layer)
