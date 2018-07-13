import numpy as np
from numpy.linalg import eig
# from logement.models import Criterion, ResultCommune
from raster.algebra.parser import RasterAlgebraParser
from sklearn.preprocessing import normalize

compare_matrix = []
w = [];


def RatingCriterion(v1, v2, v3):
    V = {"v1": v1, "v2": v2, "v3": v3}

    L1 = np.zeros(3)
    L2 = np.zeros(3)
    L3 = np.zeros(3)
    L1[0], L2[1], L3[2] = 1, 1, 1

    for k in V.keys():
        if (k == "v1"):
            if (V[k] == 9):
                L1[1] = 1 / V[k]
                L2[0] = V[k]
            elif (V[k] < 4.5):
                L1[1] = (9 - V[k]) / V[k]
                L2[0] = V[k] / (9 - V[k])
            else:
                L1[1] = V[k] / (9 - V[k])
                L2[0] = (9 - V[k]) / V[k]
        elif (k == "v2"):
            if (V[k] == 9):
                L1[2] = 1 / V[k]
                L3[0] = V[k]
            elif (V[k] < 4.5):
                L1[2] = (9 - V[k]) / V[k]
                L3[0] = V[k] / (9 - V[k])
            else:
                L1[2] = V[k] / (9 - V[k])
                L3[0] = (9 - V[k]) / V[k]
        else:
            if (V[k] == 9):
                L2[2] = 1 / V[k]
                L3[1] = V[k]
            elif (V[k] < 4.5):
                L2[2] = (9 - V[k]) / V[k]
                L3[1] = V[k] / (9 - V[k])
            else:
                L2[2] = V[k] / (9 - V[k])
                L3[1] = (9 - V[k]) / V[k]

    # Création de la matr[ice de comparaison
    compare_matrix = np.array([L1, L2, L3])
    # of colum
    S1 = np.sum(compare_matrix[0, :])
    S2 = np.sum(compare_matrix[1, :])
    S3 = np.sum(compare_matrix[2, :])

    S = [S1, S2, S3]
    T = np.sum(S)
    V = S / T
    return V


# Algèbre raster
def RasterAlgebra(cr1,cr2,cr3, poids):
    """ les noms sont les noms des critères choisis par l'utilisateur"""

    # rast1 = RasterData.objects.get(name=name1)
    # rast2 = RasterData.objects.get(name=name2)
    # rast3 = RasterData.objects.get(name=name3)

    rast1 = cr1
    rast2 = cr2
    rast3 = cr3



    # #Valeurs fournies l'utilisateur
    # c1, c2, c3 = 3, 5, 7

    # # Poids des critères
    # poids = RatingCriterion(c1, c2, c3)

    # Pondération de cha
    parser = RasterAlgebraParser()
    d1 = dict(zip(['x'], [rast1.raster50]))
    d2 = dict(zip(['x'], [rast2.raster50]))
    d3 = dict(zip(['x'], [rast3.raster50]))

    f1 = "{}*x".format(poids[0])
    f2 = "{}*x".format(poids[1])
    f3 = "{}*x".format(poids[2])

    rast1_pondere = parser.evaluate_raster_algebra(d1,f1)
    rast2_pondere = parser.evaluate_raster_algebra(d2, f2)
    rast3_pondere = parser.evaluate_raster_algebra(d3, f3)

    data = dict(zip(['x', 'y', 'z'], [rast1.raster50, rast2.raster50, rast3.raster50]))

    formula = "{}*x + {}*y + {}*z".format(poids[0],poids[1],poids[2])
    rst = parser.evaluate_raster_algebra(data,formula)
    # Enregistrement du resultat
    # dbrest = Result(raster = rst)
    # dbrest.save()
    rasters = [rast1_pondere, rast2_pondere, rast3_pondere, rst]
    return rasters