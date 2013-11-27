import os

current_dir = os.path.dirname(os.path.realpath(__file__))

SHIB_LOGIN_URL = 'https://delisle-r1.mit.edu/Shibboleth.sso/Login'
SOLR_URL = 'http://localhost/solr/'
STORAGE_ENGINE = 'kendallite.core.storage.solr'
FGDC_XSL = os.path.join(current_dir, 'fgdc.xsl')
STATIC_URL = '/static/'
SITE_ROOT = ''