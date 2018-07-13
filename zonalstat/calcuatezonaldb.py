from algorithm.zonalstats import main
from make_decision.models import Result, RasterData, Iris

#Connection à la base de données pour extraire le vector et les raster
rast1 = "PG:host=localhost port=5432 dbname='geodata' user='postgres' password='assata' schema='public'  table=make_decision_rasterdata column=raster where='id=1'"
rast2 = "PG:host=localhost port=5432 dbname='geodata' user='postgres' password='assata' schema='public'  table=make_decision_rasterdata column=raster where='id=2'"
rast3 = "PG:host=localhost port=5432 dbname='geodata' user='postgres' password='assata' schema='public'  table=make_decision_rasterdata column=raster where='id=3'"
restrast = "PG:host=localhost port=5432 dbname='geodata' user='postgres' password='assata' schema='public'  table=make_decision_rasterdata column=raster where='id=4'"
vect = "PG:host=localhost port=5432 dbname='geodata' user='postgres' password='assata'  tables=make_decision_iris"

# Appel de la fonction pour le calcul de la statistique
stats_raster1 = main(vect,rast1 )
stats_raster2 = main(vect,rast2)
stats_raster3 = main(vect,rast3)
stats_rest = main(vect,restrast )


for featid,featvalue in stats_raster1.items():
    mean_rast1 = Iris(gid=featid, firs_crite_value=featvalue[0])
    mean_rast1.save()

for featid,featvalue in stats_raster2.items():
    mean_rast2 = Iris(gid=featid, secon_crite_value=featvalue[0])
    mean_rast2.save()

for featid,featvalue in stats_raster3.items():
    mean_rast3 = Iris(gid=featid, third_crite_value=featvalue[0])
    mean_rast3.save()

for featid,featvalue in stats_raster3.items():
    mean_rest = Iris(gid=featid, resValue=featvalue[0])
    mean_rest.save()


