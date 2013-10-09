from tornado.web import RequestHandler, HTTPError
import mimeparse

class NegotiatedRequestHandler(RequestHandler):

    def initialize(self, formatters):
        formats = formatters.keys()
        match = mimeparse.best_match(
            formats, self.request.headers.get("accept"))
        self.render = formatters.get(match, None)


def authenticated(f):

    def wrapper(self, *args, **kwargs):
        if not self.current_user:
            raise HTTPError(403)
        return f(self, *args, **kwargs)

    return wrapper


def negotiate(f):

    def wrapper(self, *args, **kwargs):
        if not self.render:
            raise HTTPError(406)
        response = f(self, *args, **kwargs)
        self.render(self, response)

    return wrapper
