from lxml import etree
import StringIO
from kendallite import app

def _get_transform():
    """Returns an FGDC XSLT transformer."""
    with open(app.config.get('FGDC_XSL'), 'r') as fp:
        f = StringIO.StringIO(fp.read())

        xslt = etree.parse(f)
        xform = etree.XSLT(xslt)
        return xform

##
# Load the transformer on server start and cache for future use.
##
if app.debug:
    fgdc_transform = lambda x: _get_transform()(x)
else:
    fgdc_transform = _get_transform()
