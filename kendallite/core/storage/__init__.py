from kendallite import app
import importlib

engine = importlib.import_module(app.config.get('STORAGE_ENGINE'))