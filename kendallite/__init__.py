from tornado.web import Application
from conf import settings

def Kendallite():
    routes = settings.URLS
    return Application(routes.urls, debug=True, template_path='ogp/templates/',
        static_path='ogp/static')
