from django.shortcuts import render
from logement import models
from django.http import JsonResponse

# import ahp our application
# from ahp import ahp

# import the function main from the zonal statistics module
# from zonalstat.zonalstats import main



# Create your views here.
def home(request):
	return render(request, 'home.html')

criteria = ["Distance au lieu important (travail, école, etc.)", "Prix du loyer",
"Accessibilité au transport en commun", "Établissements sanitaire", "Accessibilité aux lieux cultureles et/ou loisirs",
"Tranquillité", "Établissements d'enseignements publics", "Emplacements de stationnement", "Proximité aux grands axes de communication"]

def aide(request):
	user = models.User.objects.create()
	user_id = user.id

	return render(request, 'aide.html', {'criteria': criteria, 'user_id': user_id})


def about(request):
	return render(request, 'about.html')


def contact(request):
	return render(request, 'contact.html')



def ajax_aide(request):

	# # get the data from ajax request 
	# # and obtain the corresponding criterion objects from the DB
	# user_id = request.GET.get('user_id', None)
	# user = models.User.objects.get(id=user_id)
	# cr1_id = request.GET.get('cr1_id', None)
	# cr1 = models.Criterion.objects.get(id=cr1_id)
	# cr2_id = request.GET.get('cr2_id', None)
	# cr2 = models.Criterion.objects.get(id=cr2_id)
	# cr3_id = request.GET.get('cr3_id', None)
	# cr3 = models.Criterion.objects.get(id=cr3_id)
	# cr1_cr2 = int(request.GET.get('cr1-cr2', None))
	# cr2_cr3 = int(request.GET.get('cr2-cr3', None))
	# cr1_cr3 = int(request.GET.get('cr1-cr3', None))

	# # Pass the comparisons to the function Rating criterion to calculate the weights
	# poids = ahp.RatingCriterion(cr1_cr2, cr1_cr3, cr2_cr3)


	# # create UserCriterion objects that correspond to user choices
	# models.UserCriterion.objects.create(user=user, criterion=cr1, weight=poids[0])
	# models.UserCriterion.objects.create(user=user, criterion=cr2, weight=poids[1])
	# models.UserCriterion.objects.create(user=user, criterion=cr3, weight=poids[2])

	# # pass the criterion objects to the function of raster algebra
	# rasters = ahp.RasterAlgebra(cr1, cr2, cr3, poids)
	# cr1_result_raster = rasters[0]
	# cr2_result_raster = rasters[1]
	# cr3_result_raster = rasters[2]
	# result_raster = rasters[3]

	# # Save the raster in the Result table
	# result = models.Result.objects.create(user_id=user_id, cr1_result_raster=cr1_result_raster, cr2_result_raster=cr2_result_raster, cr3_result_raster=cr3_result_raster, result_raster=result_raster)


	# #Connection à la base de données pour extraire le vector et les raster
	# rast1 = "PG:host=localhost port=5432 dbname='vivre_a_lyon_1' user='postgres' password='mohannad1985' schema='public'  table=logement_result column=cr1_result_raster where='user_id="+user_id+"'"
	# rast2 = "PG:host=localhost port=5432 dbname='vivre_a_lyon_1' user='postgres' password='mohannad1985' schema='public'  table=logement_result column=cr2_result_raster where='user_id="+user_id+"'"
	# rast3 = "PG:host=localhost port=5432 dbname='vivre_a_lyon_1' user='postgres' password='mohannad1985' schema='public'  table=logement_result column=cr3_result_raster where='user_id="+user_id+"'"
	# restrast = "PG:host=localhost port=5432 dbname='vivre_a_lyon_1' user='postgres' password='mohannad1985' schema='public'  table=logement_result column=result_raster where='user_id="+user_id+"'"
	# vect = "PG:host=localhost port=5432 dbname='vivre_a_lyon_1' user='postgres' password='mohannad1985'  tables=logement_commune"

	# # pass the rasters to the function of zonal statistics
	# stats_raster1 = main(vect,rast1)
	# stats_raster2 = main(vect,rast2)
	# stats_raster3 = main(vect,rast3)
	# stats_rest = main(vect,restrast)


	# # save the results of zonal statistics to the corresponding columns in the table ResultCommune
	# for featid,featvalue in stats_raster1.items():
	# 	commune = models.Commune.objects.get(id=featid)
	# 	mean_rast1 = models.ResultCommune(user=user, commune=commune, criterion1_value=featvalue[0])
	# 	mean_rast1.save()

	# for featid,featvalue in stats_raster2.items():
	# 	commune = models.Commune.objects.get(id=featid)
	# 	mean_rast2 = models.ResultCommune(user=user, commune=commune, criterion2_value=featvalue[0])
	# 	mean_rast2.save()

	# for featid,featvalue in stats_raster3.items():
	# 	commune = models.Commune.objects.get(id=featid)
	# 	mean_rast3 = models.ResultCommune(user=user, commune=commune, criterion3_value=featvalue[0])
	# 	mean_rast3.save()

	# for featid,featvalue in stats_raster3.items():
	# 	commune = models.Commune.objects.get(id=featid)
	# 	mean_rest = models.ResultCommune(user=user, commune=commune, result_value=featvalue[0])
	# 	mean_rest.save()


	# # filter the table ResultCommune to have only the data of the user
	# resultcommune_filtered = models.ResultCommune.objects.filter(user=user)





	return JsonResponse({'success': True})
