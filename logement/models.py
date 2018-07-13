# from django.db import models
from django.contrib.gis.db import models


# Create your models here.
class Criterion(models.Model):
	name = models.CharField(max_length=150)
	description = models.TextField(null=True, blank=True)
	raster10 = models.RasterField(null=True, blank=True)
	raster50 = models.RasterField(null=True, blank=True)

	def __str__(self):
		return self.name

class User(models.Model):
	criteria = models.ManyToManyField(Criterion, through=u'UserCriterion')

class UserCriterion(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	criterion = models.ForeignKey(Criterion, on_delete=models.CASCADE)
	weight = models.DecimalField(max_digits=4, decimal_places=3, null=True, blank=True)

class Commune(models.Model):
	# Regular Django fields corresponding to the attributes in the
    # commune shapefile.
    id_geofla = models.CharField(max_length=24)
    code_com = models.CharField(max_length=3)
    insee_com = models.CharField(max_length=5)
    nom_com = models.CharField(max_length=50)
    superficie = models.BigIntegerField()
    code_dept = models.CharField(max_length=2)
    nom_dept = models.CharField(max_length=30)

    # GeoDjango-specific: a geometry field (MultiPolygonField)
    mpoly = models.MultiPolygonField(null=True)

    def __str__(self):
    	return self.nom_com

class Result(models.Model):
	user = models.OneToOneField(User,on_delete=models.CASCADE,primary_key=True)
	commune = models.ManyToManyField(Commune, through='ResultCommune')
	cr1_result_raster = models.RasterField(null=True, blank=True)
	cr2_result_raster = models.RasterField(null=True, blank=True)
	cr3_result_raster = models.RasterField(null=True, blank=True)
	result_raster = models.RasterField(null=True, blank=True)
	date_time = models.DateTimeField(auto_now=True)


class ResultCommune(models.Model):
	result = models.ForeignKey(Result, on_delete=models.CASCADE)
	commune = models.ForeignKey(Commune, on_delete=models.CASCADE)
	criterion1_value = models.DecimalField(max_digits=6, decimal_places=3)
	criterion2_value = models.DecimalField(max_digits=6, decimal_places=3)
	criterion3_value = models.DecimalField(max_digits=6, decimal_places=3)
	result_value = models.DecimalField(max_digits=6, decimal_places=3)











