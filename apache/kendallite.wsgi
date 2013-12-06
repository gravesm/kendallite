import sys
import site

# path to kendallite directory
sys.path.insert(0, '')

# path to virtualenv, e.g. /home/foo/.virtualenvs/kendallite/lib/python2.7/site-packages
site.addsitedir('')

from kendallite import app as application
