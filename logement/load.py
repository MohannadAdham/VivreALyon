import os
from django.contrib.gis.utils import LayerMapping
from .models import Commune

commune_mapping = {
    'id_geofla' : 'ID_GEOFLA',
    'code_com' : 'CODE_COM',
    'insee_com' : 'INSEE_COM',
    'nom_com' : 'NOM_COM',
    'superficie' : 'SUPERFICIE',
    'code_dept' : 'CODE_DEPT',
    'nom_dept' : 'NOM_DEPT',
    'mpoly' : 'MULTIPOLYGON',
}

commune_shp = os.path.abspath('C:/vivre_a_lyon/logement/data/commune_wgs84.shp')

def run(verbose=True):
    lm = LayerMapping(
        Commune, commune_shp, commune_mapping,
        transform=False, encoding='utf-8',
    )
    lm.save(strict=True, verbose=verbose)