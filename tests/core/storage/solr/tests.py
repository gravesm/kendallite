from mock import patch, MagicMock
from tornado.testing import AsyncTestCase, gen_test
from tornado.concurrent import Future
from tornado.httpclient import HTTPResponse, HTTPRequest
from cStringIO import StringIO
import unittest

from kendallite.core.storage import solr


def mock_client(client, resp=None):

    def fetch(request, **kwargs):
        if not isinstance(request, HTTPRequest):
            request = HTTPRequest(url=request, **kwargs)
        body = resp or ''
        response = HTTPResponse(request, 200, buffer=StringIO(body))

        future = Future()
        future.set_result(response)
        return future

    client.fetch = fetch


class TestLayerRetrieval(AsyncTestCase):

    def setUp(self):
        super(TestLayerRetrieval, self).setUp()
        self.Layer = MagicMock()
        self.Layer.return_value = 'Mumblebuckus'

    @gen_test
    def test_layer_called_with_response(self):
        with patch('kendallite.core.storage.solr.get_client') as mock:
            mock_client(mock(), 'Pufflewhip')
            yield solr.get_layer(self.Layer, 'id')
            self.Layer.assert_called_with('Pufflewhip')

    @gen_test
    def test_layer_returned(self):
        with patch('kendallite.core.storage.solr.get_client') as mock:
            mock_client(mock())
            res = yield solr.get_layer(self.Layer, 'id')
            self.assertEquals(res, 'Mumblebuckus')


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
