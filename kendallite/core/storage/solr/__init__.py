import requests
import json
from kendallite import app
from kendallite.core.exceptions import LayerNotFoundError

def load_layer(layer, *args, **kwargs):

        response = args[0]

        res = json.loads(response)

        if not len(res['response']['docs']):
            raise LayerNotFoundError

        doc = res['response']['docs'][0]

        for k,v in layer._fields.items():
            if v.name in doc:
                setattr(layer, k, v.add_to_class(doc[v.name]))

def get_layer(cls, id):

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

    url = "{0}/select/".format(app.config.get('SOLR_URL').rstrip("/"))
    res = requests.get(url, params=params)

    return cls(res.text)
