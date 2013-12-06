from flask import Flask
import os

os.environ.setdefault("KENDALLITE_SETTINGS", "site/settings.py")

app = Flask(__name__)
app.config.from_envvar('KENDALLITE_SETTINGS')

import kendallite.site.views
