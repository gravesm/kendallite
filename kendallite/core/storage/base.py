from kendallite.core.storage import engine

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
        engine.load_layer(self, *args, **kwargs)

    @classmethod
    def get(cls, id):
        return engine.get_layer(cls, id)
