import json

class Field(object):
    def __init__(self, name, **kwargs):
        self._data_field = True
        self.name = name
        self.default = kwargs.get('default', None)

    def add_to_class(self, value):
        return value


class JSONField(Field):

    def add_to_class(self, value):
        return json.loads(value)
