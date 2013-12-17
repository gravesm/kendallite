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
        return "{0}:{1}".format(self._workspace_name, self._name)

    @property
    def harvard_layer_name(self):
        """Return the layer's name for locating in Harvard's tilecache.

        This is analagous to the layer_name property, except that layers are
        identified differently when pulling from Harvard's instance of
        tilecache.

        """
        if self.institution.lower() in ('harvard',):
            return self._name.split(".", 1)[1]
        return None

    @property
    def is_vector(self):
        return self.datatype.lower() in ('point', 'line', 'polygon',)

    @property
    def is_raster(self):
        return self.datatype.lower() in ('paper map', 'raster',)

    @property
    def is_restricted(self):
        return self.access.lower() in ('restricted')

    @property
    def wkt(self):
        """Return a WKT representation of the bounding box."""
        wkt = "POLYGON(({0} {1}, {2} {3}, {4} {5}, {6} {7}, {8} {9}))".format(
            self.minx, self.miny, # SW
            self.maxx, self.miny, # SE
            self.maxx, self.maxy, # NE
            self.minx, self.maxy, # NW
            self.minx, self.miny # SW
        )
        return wkt

    @property
    def wms_urls(self):
        """Return a string representation of the list of WMS URLs.

        This can be used directly as, for example, a JavaScript array in
        OpenLayers. Preference is given to tilecache URLs if present.

        """
        f = lambda x: "'{0}'".format(x)
        g = lambda y: ",".join(map(f, y))

        if ('tilecache' in self.location):
            return "[{0}]".format(g(self.location['tilecache']))
        return "[{0}]".format(g(self.location['wms']))
