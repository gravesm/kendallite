import unittest
from mock import MagicMock, patch

from kendallite.core.storage import fields
from kendallite.core.storage import base


class TestField(unittest.TestCase):

    def setUp(self):
        self.field = fields.Field('Rumbletums', default='Nootlecruf')

    def test_data_field_is_true(self):
        self.assertTrue(self.field._data_field)

    def test_sets_default_value(self):
        self.assertEqual(self.field.default, 'Nootlecruf')

    def test_sets_name(self):
        self.assertEqual(self.field.name, 'Rumbletums')

    def test_add_to_class_returns_value(self):
        self.assertEqual(self.field.add_to_class('Bubbletrop'), 'Bubbletrop')


class TestJSONField(unittest.TestCase):

    def setUp(self):
        self.field = fields.JSONField('Fiddleplume')

    def test_add_to_class_returns_json(self):
        data = self.field.add_to_class('{"bipple": "bopple"}')
        self.assertEqual(data['bipple'], 'bopple')

    def test_parses_unwrapped_json(self):
        data = self.field.add_to_class('"bipple": "bopple"')
        self.assertEqual(data['bipple'], 'bopple')


class TestDoc(unittest.TestCase):

    def test_get_calls_get_layer(self):
        with patch('kendallite.core.storage.base.engine') as mock:
            mock.get_layer = MagicMock()
            base.Doc.get('Frumripple')
            mock.get_layer.assert_called_with(base.Doc, 'Frumripple')

    def test_init_call_load_layer(self):
        with patch('kendallite.core.storage.base.engine') as mock:
            mock.load_layer = MagicMock()
            doc = base.Doc("Kurpleton")
            mock.load_layer.assert_called_with(doc, "Kurpleton")

class TestDocBase(unittest.TestCase):

    def setUp(self):
        field = MagicMock()
        field._data_field = True
        field.default = 'grumplenook'

        class DocClass(object):
            __metaclass__ = base.DocBase

            fimblerumpus = field

        self.DocClass = DocClass

    def test_docbase_sets_field_default(self):
        doc = self.DocClass()
        self.assertEqual(doc.fimblerumpus, 'grumplenook')
