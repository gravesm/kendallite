from kendallite import app
from kendallite.site.layer import Layer
from kendallite.core import transformer
from flask import render_template, request, g, abort, url_for
import requests
from lxml import etree


@app.before_request
def authenticate():
    g.user = request.headers.get('Remote_user')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/wfs/')
def wfs():
    layer = Layer.get(request.args.get('OGPID'))

    if layer.is_restricted:
        abort(403)

    # Because Harvard tilecache layers have a different name than what's in
    # Geoserver we need to correct the layer names in the GetFeatureInfo request
    params = request.args.copy()
    params['LAYERS'] = layer.layer_name
    params['QUERY_LAYERS'] = layer.layer_name
    params.pop('OGPID')

    res = requests.get(layer.location['wfs'], params=params)
    return res.text

@app.route('/layer/<layer_id>/')
def layer(layer_id):
    layer = Layer.get(layer_id)

    context = { "authorized": authorized(layer) }

    if layer.is_vector:
        if (layer.institution.lower() == "mit") and layer.is_restricted:
            context['wfs'] = layer.location['wfs']
        else:
            context['wfs'] = url_for('wfs')

    if layer.is_vector or layer.is_raster:
        context['fgdc'] = transform(layer.fgdc, transformer.fgdc_transform)
        return render_template('tiled.html', layer=layer, **context)
    else:
        return render_template('bbox.html', layer=layer, **context)

def transform(xml, transform):
    root = etree.XML(xml.strip().encode('utf-8'))
    return transform(root)

def authorized(layer):
    return (g.user and layer.institution.lower() == "mit") or not layer.is_restricted
