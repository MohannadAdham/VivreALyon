from django.shortcuts import render


criteria = ["Distance au lieu important (travail, école, etc.)", "Prix du loyer",
"Accessibilité au transport en commun", "Établissements sanitaire", "Accessibilité aux lieux cultureles et/ou loisirs",
"Tranquillité", "Établissements d'enseignements publics", "Emplacements de stationnement", "Proximité aux grands axes de communication"]
# Create your views here.
def preferences(request):
	return render(request, 'preferences.html', {'criteria': criteria})