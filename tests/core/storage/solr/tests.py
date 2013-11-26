from mock import patch, MagicMock
import unittest

from kendallite.core.storage import solr


class TestLayerRetrieval(unittest.TestCase):

    def setUp(self):
        self.Layer = MagicMock()
        self.Layer.return_value = 'Mumblebuckus'

    def test_layer_called_with_response_text(self):
        with patch('requests.get') as mock:
            solr.get_layer(self.Layer, 'id')
            self.Layer.assert_called_with(mock().text)

    def test_layer_returned(self):
        with patch('requests.get') as mock:
            layer = solr.get_layer(self.Layer, 'id')
            self.assertEquals(layer, 'Mumblebuckus')


class TestLayerLoading(unittest.TestCase):

    RESPONSE = '{"response": {"docs": [{"Limplenick": "Snifflemuppus"}]}}'

    def setUp(self):
        self.Field = MagicMock()
        self.Field.name = "Limplenick"
        self.Field.add_to_class = MagicMock(return_value='Zumpleripus')

        self.Layer = MagicMock()
        self.Layer._fields = {'bumberstumple': self.Field}

    def test_calls_add_to_class_method(self):
        solr.load_layer(self.Layer, self.RESPONSE)
        self.Field.add_to_class.assert_called_with("Snifflemuppus")

    def test_layer_attribute_is_set(self):
        solr.load_layer(self.Layer, self.RESPONSE)
        self.assertEquals(self.Layer.bumberstumple, 'Zumpleripus')
