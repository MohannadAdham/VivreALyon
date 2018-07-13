


var panorama;
var map;
var placesService;
var markersCount = 0;
var markers = [];
var POILatlng; // lat/lng de POI choisi
var markersArray = [];
var POI;// variable pour mettre contient le poi courrant
var i=1; // indice pour les POIS, pour ne pas afficher le meme poi plusieurs fois
var POIs=[];
var POIcounter = 0;



	//fonction utiliser pour chercher l'angle entre la rue et le poi pour centraliser le street view vers le poi directement
	function computeAngle(endLatLng, startLatLng) {
      var DEGREE_PER_RADIAN = 57.2957795;
      var RADIAN_PER_DEGREE = 0.017453;
      var dlat = endLatLng.lat() - startLatLng.lat();
      var dlng = endLatLng.lng() - startLatLng.lng();
      // We multiply dlng with cos(endLat), since the two points are very closeby,
      // so we assume their cos values are approximately equal.
      var yaw = Math.atan2(dlng * Math.cos(endLatLng.lat() * RADIAN_PER_DEGREE), dlat)
             * DEGREE_PER_RADIAN;
      return wrapAngle(yaw);
   }
   function wrapAngle(angle) {
    if (angle >= 360) {
      angle -= 360;
    } else if (angle < 0) {
     angle += 360;
    }
    return angle;
  };

  	// a list of a number of types to use in the search
  	var types = ['bank', 'book_store', 'park', 'pharmacy', 'clothing_store',
  				 'restaurant', 'post_office', 'movie_theater',
  				 'shoe_store', 'store', 'furniture_store', 'hair_care', 'travel_agency',
  				  'home_goods_store', 'florist', 'post_office', 'bus_station'];


	function choisirPOIs(){
	// Choose a new type for each point
	var type = types[Math.floor(Math.random() * types.length)];
	console.log(type);
	var request = {
          location: quartierChoisiLatlng,
          radius: 800,
          type: type
        };

    var service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, function(results, status){
			if (status == google.maps.places.PlacesServiceStatus.OK) {
			console.log(results);
			i = Math.floor(Math.random() * results.length);
			chercherPOI(results[i], type);
			}
			});
	}

	function chercherPOI(POI, type)
	{
			POILatlng=POI.geometry.location;

			 //ajouter le POI a street view et afficher le nom de place
			 var markerPOI2 = new google.maps.Marker({
						map: panorama,
						position: POILatlng
			});
			markersArray.push(markerPOI2);
			if (type == 'bus_station') {
			infowindow.setContent('<div><b>' + POI.name + ' - station de bus </b></div>');
			} else {
			infowindow.setContent('<div><b>' + POI.name + '</b></div>');
			}
			infowindow.open(panorama, markerPOI2);
			google.maps.event.addListener(markerPOI2, 'click', function() {
			infowindow.setContent('<div><b>' + POI.name + '</b></div>');
			infowindow.open(panorama, markerPOI2);
			});

			//chercher le streetview le plus proche de POI
			sv.getPanoramaByLocation(POILatlng, 50, function (data, status) {
										if (status == google.maps.StreetViewStatus.OK) {
										//positioner le street view vers le panorama trouver
										panorama.setPosition(data.location.latLng);
										//chercher l'angle entre le POI et le panorama trouver
										var angle=computeAngle(markerPOI2.getPosition(),panorama.getPosition());
										//changer l'angle "heading" de panorama pour qu'il se fixe vers le POI
										panorama.setPov({
													heading: angle,
													pitch: 0,
													zoom:1
												  });
										}
			});	//fin de chercher de streetview
	}

function init() {
	sv = new google.maps.StreetViewService();
	var markerStreetView = new google.maps.Marker(); //marker pour le Street View
    quartierChoisiLatlng =new google.maps.LatLng(45.43697812890, 4.39012941954);
    infowindow= new google.maps.InfoWindow();


	//initiate the panorama
	panorama = new google.maps.StreetViewPanorama(
	        document.getElementById('pano'), {
	          pov: {
	            heading: 180,
	            pitch: 0
	          },
	          visible: true,
              disableDoubleClickZoom: true,
              addressControl: false
	  });

	map = new google.maps.Map(
		document.getElementById('map'),
		{visible: false});

	choisirPOIs(); //chercher un POI proche de quartier de 500 m et l'afficher sur la carte et le streetview
	//initiate the map (A hidden map is added because it is required by google places)

	markerStreetView.setMap(panorama);
}

	function reIntialiser(){
			POIcounter = POIcounter + 1;
			// $('#nombreLieu').html(POIcounter);
			// chercherPOI(POIs[POIcounter]);
			choisirPOIs();
			//$('#afficherCarte').removeAttr("disabled");
			//$('#map').hide();
			bienSitue="";
			malPlace="";
			// $('#rang_bouton').show();
			// if (POIcounter>4)$('#final_bouton').show();
	}

$('#btn-interets').click(function() {
	$('.timer-contain').slideToggle();
	$('#question').slideToggle();
	if ($(this).text() != "Non") {
		$(this).text("Non");
		$('#btn-reperes').text("Oui");
		$('#btn-reperes').css('background', '#00C851' );
	} else {
		$(this).text("Point d'Interet");
		$('#btn-reperes').css('background', '#4285F4' );
		$('#btn-reperes').text("Point de Repere");
		reIntialiser();
	}
});

$('#btn-reperes').click(function() {
	$('.timer-contain').slideToggle();
	$('#question').slideToggle();
	if ($(this).text() != "Oui") {
		$(this).text("Oui");
		$('#btn-interets').text("Non");
		$(this).css('background', '#00C851' );
	} else {
		$(this).text("Point de Repere");
		$('#btn-interets').text("Point d'Interet");
		$(this).css('background', '#4285F4' );
		reIntialiser();
	}
});






 $('.navbar').hover(
 	function() {
 		$(this).animate({opacity: '1'}, 500);
 },
 	function(){
 		$(this).animate({opacity: '0.7'}, 500);
 	});