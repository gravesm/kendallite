from nose.tools import raises
import importlib
import os
import unittest

from kendallite import conf


class TestSettingsContainer(unittest.TestCase):

    def test_uppercase_settings_set(self):
        settings_module = importlib.import_module(os.environ['KENDALLITE_SETTINGS'])
        setattr(settings_module, 'BIMBLEWHUMP', 'MEGA-LUMPUS!')
        settings = conf.SettingsContainer(settings_module)
        self.assertEqual(settings.BIMBLEWHUMP, 'MEGA-LUMPUS!')

    @raises(AttributeError)
    def test_lowercase_settings_not_set(self):
        settings_module = importlib.import_module(os.environ['KENDALLITE_SETTINGS'])
        setattr(settings_module, 'spindletuff', 'paddletop')
        settings = conf.SettingsContainer(settings_module)
        settings.spindletuff


class TestSettings(unittest.TestCase):

    def test_has_settings_attribute(self):
        conf.settings.SETTINGS

    def test_urls_is_module(self):
        from types import ModuleType
        self.assertIsInstance(conf.settings.URLS, ModuleType)
