
WMS_URL = "http://delisle.mit.edu:8080/geoserver/wms"
WFS_URL = WMS_URL

WMS_SECURE_URL = "https://delisle.mit.edu/secure-geoserver/wms"
WFS_SECURE_URL = WMS_SECURE_URL

NON_PROXIED_HOSTS = (
    # The application will not proxy requests to these hosts
    'http://delisle.mit.edu:8080/',
    'https://delisle.mit.edu/',
    'http://arrowsmith.mit.edu:8080/',
    'https://arrowsmith.mit.edu/',
)

SOLR_URL = 'http://localhost/solr/'

URLS = 'app.routes'

STORAGE_ENGINE = 'core.storage.solr'

FGDC_XSL = '/home/gravm/git/kendallite/server/app/fgdc.xsl'
