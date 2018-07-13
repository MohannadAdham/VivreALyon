from django.contrib.gis import admin

from logement.models import *

admin.site.register(User, admin.ModelAdmin)
admin.site.register(Criterion, admin.ModelAdmin)
admin.site.register(UserCriterion, admin.ModelAdmin)
admin.site.register(Result, admin.ModelAdmin)
admin.site.register(Commune, admin.GeoModelAdmin)
admin.site.register(ResultCommune, admin.ModelAdmin)
