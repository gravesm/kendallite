from kendallite import app
from kendallite.site.layer import Layer
from kendallite.core import transformer
from kendallite.core.exceptions import LayerNotFoundError
from flask import render_template, request, g, abort, url_for, Response
import requests
from lxml import etree


@app.before_request
def authenticate():
    g.user = request.environ.get('REMOTE_USER')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/wfs/')
def wfs():
    try:
        layer = Layer.get(request.args.get('OGPID'))
    except LayerNotFoundError:
        abort(404)

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
    try:
        layer = Layer.get(layer_id)
    except LayerNotFoundError:
        abort(404)

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

@app.route('/layer/<layer_id>/metadata/')
def metadata(layer_id):
    try:
        layer = Layer.get(layer_id)
    except LayerNotFoundError:
        abort(404)
    tree = etree.fromstring(layer.fgdc.strip().encode("utf-8"))
    res = etree.tostring(tree, encoding="UTF-8", pretty_print=True)
    return Response(res,
                    headers={
                        'Content-Type': 'application/xml; charset=UTF-8',
                        'Content-Disposition': 'attachment; filename=fgdc.xml'})

@app.route('/download/email/')
def email_download():
    """Proxy request to download layer through email.

    This is currently only used for downloading raster layers from Harvard.

    """
    try:
        layer = Layer.get(request.args.get('OGPID'))
    except LayerNotFoundError:
        abort(404)
    email = request.args.get('email')
    bbox = request.args.get('bbox') or (
        "{0},{1},{2},{3}".format(layer.minx, layer.miny, layer.maxx, layer.maxy))
    xmin, ymin, xmax, ymax = bbox.split(",")
    params = {
        'LayerName': layer._name,
        'UserEmail': email,
        'XMin': xmin,
        'YMin': ymin,
        'XMax': xmax,
        'YMax': ymax,
        'Clip': 'true',
        'AppID': 55,
        'EncryptionKey': 'OPENGEOPORTALROCKS',
    }

    res = requests.get(layer.location.get("download"), params=params)
    return (res.text, res.status_code,)

def transform(xml, transform):
    root = etree.XML(xml.strip().encode('utf-8'))
    return transform(root)

def authorized(layer):
    return (g.user and layer.institution.lower() == "mit") or not layer.is_restricted
