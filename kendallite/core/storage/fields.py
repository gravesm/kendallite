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
        try:
            return json.loads(value)
        except ValueError as err:
            # There's a lot of data that's not properly wrapped. Make an attempt
            # to parse this, otherwise it's someone else's problem
            value = "{{ {0} }}".format(value)
            return json.loads(value)
