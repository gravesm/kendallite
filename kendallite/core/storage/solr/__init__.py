from tornado.httpclient import AsyncHTTPClient
from tornado.httputil import url_concat
import json
from tornado import gen
from kendallite.conf import settings

def load_layer(layer, *args, **kwargs):

        response = args[0]

        res = json.loads(response)

        doc = res['response']['docs'][0]

        for k,v in layer._fields.items():
            if v.name in doc:
                setattr(layer, k, v.add_to_class(doc[v.name]))

@gen.coroutine
def get_layer(cls, id):
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
    url = "{0}/select/".format(settings.SOLR_URL.rstrip("/"))
    response = yield http.fetch(url_concat(url, params))

    layer = cls(response.body)

    raise gen.Return(layer)
