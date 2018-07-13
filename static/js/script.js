


var panorama;
var map;
var placesService;
var markersCount = 0;
var markers = [];

function init() {
	//initiate the panorama
	panorama = new google.maps.StreetViewPanorama(
	        document.getElementById('pano'), {
	          position: {lat: 45.442463 , lng: 4.386276},
	          pov: {
	            heading: 180,
	            pitch: 0
	          },
	          visible: true
	  });
	//initiate the map (A hidden map is added because it is required by google places)
	map = new google.maps.Map(
		document.getElementById('map'),
		{visible: false});

	//initiate google places service
	placesService = new google.maps.places.PlacesService(map);

	// Double-click event in the panorama
	$("#pano").dblclick(function() {
		console.log("panorama has double-clicked")
		// 1. calculate the position of the clicked place
		var offset = 10;
		var position = computePosition(panorama, offset);
		// 2. create a marker at that place
		var marker = new google.maps.Marker({
			position: position,
			animation: google.maps.Animation.DROP,
			map: panorama
		});
		// 3. get a list of the nearest POIs from google places service 
		//    and assign it to the POIs property of the marker (POIs is not a native property of google 
		//	  marker object, we create it to hold the list of POIs related to the marker)
		var request = {
	        location: position,
	        radius: 10
	          };
		getPlaces(request, marker);
	});
}

function computePosition(panorama, offset) {
	return google.maps.geometry.spherical.computeOffset(panorama.getPosition(), offset, panorama.getPov().heading);
}

function getPlaces(request, marker) { 
	console.log("getPlaces has been called");
	placesService.nearbySearch(request, callback);
    function callback(results, status){
    	console.log("callback function called");
    	if (status == google.maps.places.PlacesServiceStatus.OK) {
    		marker.POIs = results;  // return a list of the nearest POIs
		} 

		dbClickContinue(marker);
	}
}


// since the google places api uses a callback function that wouldn't 
// return the list of POIs before finishing all other statements in the
// double-click event, we continue the definition of the event in a function 
// that is called by the callback function
function dbClickContinue(marker) {
	// 4. initiate the infowindow
		var infoWindow = new google.maps.InfoWindow();

		// 5. define the content of the infowindow
		var content = "<div>" + marker.POIs.map(function(el) {
	                return '<br/>' + el.name;
	              }).join('') +'</div';

		// 5. add a marker click listener and set the content to 
		// the list of closest POIs
		google.maps.event.addListener(marker,'click', (function(marker,content,infoWindow){ 
	        return function() {
	           infoWindow.setContent(content);
	           infoWindow.open(map,marker);
	           writeToSideMenu(marker);
	        };
	    })(marker,content,infoWindow)); 
}

// $( function() {
//     $( "#side-menu" ).accordion();
//   } );

        
    function writeToSideMenu(marker) {
    	var index = 1;
    	console.log(marker.POIs[0]);
    	$("label").hide();
    	for (var i = 0; i < marker.POIs.length; i++) {
    		console.log(marker.POIs[i].name);
    		if (marker.POIs[i].name !== "Saint-Étienne" && marker.POIs[i].name.indexOf("Rue") === -1 ) {
	    		$("form p:nth-child(" + (index) + ") label").show();
	    		$("form p:nth-child(" + (index) + ") label").html(marker.POIs[i].name);
	    		index += 1;
	    		}    		
    	}
    	
    	
    	// $("#side-menu :nth-child(2)").hide();

    }