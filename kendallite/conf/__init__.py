import os
import importlib # will need to install importlib from pypi for python < 2.7

class Settings(object):

    def __init__(self):
        os.environ.setdefault("KENDALLITE_SETTINGS", "ogp.settings")
        settings_module = importlib.import_module(os.environ['KENDALLITE_SETTINGS'])
        self.SETTINGS = SettingsContainer(settings_module)

    def __getattr__(self, name):
        MODULE_SETTINGS = ("URLS", "STORAGE_ENGINE")

        if name in MODULE_SETTINGS:
            return importlib.import_module(getattr(self.SETTINGS, name))

        return getattr(self.SETTINGS, name)


class SettingsContainer(object):

    def __init__(self, settings):
        for setting in dir(settings):
            if setting == setting.upper():
                value = getattr(settings, setting)
                setattr(self, setting, value)


settings = Settings()
