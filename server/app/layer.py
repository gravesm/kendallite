from core.storage import base
from core.storage import fields

class Layer(base.Doc):

    access = fields.Field("Access")
    location = fields.JSONField("Location")
