from kendallite.core.storage import base
from kendallite.core.storage import fields

class Layer(base.Doc):

    id = fields.Field('LayerId')
    access = fields.Field("Access")
    location = fields.JSONField("Location")
    name = fields.Field("LayerDisplayName")
    fgdc = fields.Field("FgdcText")
    keywords_place = fields.Field("PlaceKeywords")
    keywords_theme = fields.Field("ThemeKeywords")
    institution = fields.Field("Institution")
    datatype = fields.Field("DataType")
    maxx = fields.Field("MaxX")
    maxy = fields.Field("MaxY")
    minx = fields.Field("MinX")
    miny = fields.Field("MinY")

    _workspace_name = fields.Field("WorkspaceName")
    _name = fields.Field("Name")

    @property
    def layer_name(self):
        return "{}:{}".format(self._workspace_name, self._name)

    @property
    def is_vector(self):
        return self.datatype.lower() in ('point', 'line', 'polygon',)

    @property
    def is_raster(self):
        return self.datatype.lower() in ('paper map', 'raster',)

    @property
    def wkt(self):

        wkt = "POLYGON(({} {}, {} {}, {} {}, {} {}, {} {}))".format(
            self.minx, self.miny, # SW
            self.maxx, self.miny, # SE
            self.maxx, self.maxy, # NE
            self.minx, self.maxy, # NW
            self.minx, self.miny # SW
        )

        return wkt
