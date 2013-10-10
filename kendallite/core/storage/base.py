from kendallite.conf import settings
from tornado import gen

class DocBase(type):

    def __new__(cls, name, bases, attrs):

        layer = super(DocBase, cls).__new__(cls, name, bases, attrs)

        attrs.pop('__module__')

        layer._fields = {}

        for field, value in attrs.items():
            if hasattr(value, '_data_field'):
                setattr(layer, field, value.default)
                layer._fields[field] = value

        return layer


class Doc(object):

    __metaclass__ = DocBase

    def __init__(self, *args, **kwargs):
        engine = settings.STORAGE_ENGINE
        engine.load_layer(self, *args, **kwargs)

    @classmethod
    @gen.coroutine
    def get(cls, id):
        engine = settings.STORAGE_ENGINE
        layer = yield engine.get_layer(cls, id)

        raise gen.Return(layer)
