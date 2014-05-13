from flask import Flask
import os

os.environ.setdefault("KENDALLITE_SETTINGS", "site/settings.py")

app = Flask(__name__)
app.config.from_envvar('KENDALLITE_SETTINGS')

# I cannot get the LOGGER_NAME config option, which seems like the right way to
# do this, to work.
for handler in app.config.get('HANDLERS', []):
    app.logger.addHandler(handler)

import kendallite.site.views
