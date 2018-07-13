    var static_url = "{% get_static_prefix %}";
    // Define variables
    var map_center = {lat: 45.752610, lng: 4.835268}; // For google maps API
    var user_location;  // The location entered by the user for the first criterion
    var first_criterion; // A boolean value that indicates if the first criterion is selected by the user
    var counter_popup = 0;
    var wmsLoaded = false; // // To activate the click event handler when the wms layer is loaded
    // define the variables that will be used to hold the xhttp response
    var commune_code;
    var commune_name;
    var criterion_1;
    var criterion_2;
    var criterion_3;
    var result;
    // define a variable to hold the canvas of d3.js
    var canvas_html;
    // define a variable for the Google Street View Panorama
    var panorama;
    var lnglat = [4.835268, 45.752610];
    // define a variable for to hold the comparisons between the criteria
    var comparison_list = [];

    $(document).ready(function(){
        setTimeout(function(){
            $('#panel-1').slideDown(1000); 
        }, 400);
        console.log("user: " + user_id);

    });


      var untiled = new ol.layer.Image({
        source: new ol.source.ImageWMS({
          ratio: 1,
          url: 'http://localhost:8080/geoserver/test/wms',
          params: {'VERSION': '1.1.1',  
                STYLES: '',
                LAYERS: 'test:commune_wgs84',
          }
        })
      });



    // Define the list of layers for Openlayers
    var layers = [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
          type: "base",

        }),
        ];



    // Define the map object
    var map = new ol.Map({
        layers: layers,
        target: 'map',
        view: new ol.View({
          center: ol.proj.transform([4.835268, 45.79150], 'EPSG:4326', 'EPSG:3857'),
          zoom: 10,
        })
      });

        map.getLayers().on('change:length', function (e) {
            e.target.forEach(function (capa) {
                if (capa instanceof ol.layer.Image) {
                    var source = capa.getSource();

                    source.on('imageloadstart', function () {
                        ///do whatever you want
                    });
                    source.on('imageloadend', function () {
                        console.log("The image is loaded");
                        wmsLoaded = true;

                    });
                    source.on('imageloaderror', function () {
                        ///do whatever you want
                    });
                }
            });
        });





// ---------------------- Map Click Event ---------------------------------

      // Add click event to the map
      map.on('singleclick', function(evt) {
        // We have here two cases (The first step and the final popup)
        var map_layers = map.getLayers();
        // var map_layers_number = map_layers.U.length;
        var map_layers_number = map_layers.array_.length;  // for v4 Debug of OpenLayers
        // map_layers_number = map_layers.U.length; // for v3 of OpenLayers

        // The first case
        if (first_criterion && (map_layers_number === 1)) {
            $("#drop-audio").get(0).play();
            // Add a marker to the map
            var iconFeatures=[];
            var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(evt.coordinate),
            name: 'user location',
            });
            console.log("coordinates = " + iconFeature.getCoordinates);
            console.log(iconFeature);
            iconFeatures.push(iconFeature);


            var vectorSource = new ol.source.Vector({
            features: iconFeatures //add an array of features
            });

            var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 44],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.9,
            src: icon_path,
                }))
            });

            console.log(vectorSource);
            console.log(evt.coordinate);
            var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: iconStyle
            });

            map.addLayer(vectorLayer);


            // var layerSwitcher = new ol.control.LayerSwitcher({
            //     tipLabel: 'Légende' // Optional label for button
            //     });
            // map.addControl(layerSwitcher);


            // Hide panel-4 and show panel-2
            $('#panel-4').slideUp(600);
            setTimeout(function() {
                $('#panel-2').fadeIn(800);
                console.log("panel-2");
            }, 600);
        } else if (wmsLoaded) {
            console.log("counter = " + counter_popup);
            if (counter_popup % 2 === 1) { 
                // map.popups[0].destroy();
                $(element).popover('destroy');
                counter_popup += 1;
            } else if (counter_popup % 2 === 0){
            console.log("popup");
            counter_popup += 1;

            // --------------- Query Geoserver -----------

            var coordinate = evt.coordinate;
            lnglat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
            console.log("lnglat = " + lnglat);
            // var bounds = [4.55920791625977, 45.521183013916,
            //         5.09806823730469, 46.0638809204102];
            // map.getView().fit(bounds, map.getSize());
                console.log("Loading... please wait...");
                var view = map.getView();
                var viewResolution = view.getResolution();
                var source = untiled.get('visible') ? untiled.getSource() : tiled.getSource();
                var url = source.getGetFeatureInfoUrl(
                coordinate, viewResolution, view.getProjection(),
                {'INFO_FORMAT': 'text/html', 'FEATURE_COUNT': 50});
                if (url) {
                console.log(url);
                }
                // Create dom element to hold the xhttp response
                var el = $( '#test-response' );
                // send and receive the request
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                        // Typical action to be performed when the document is ready:
                        // document.getElementById("demo").innerHTML = xhttp.responseText;
                        // console.log(xhttp.responseText);
                        el.html(xhttp.responseText);
                        var table = $('.featureInfo', el);
                        console.log(table.html());
                        var tds = $('td', table);
                        console.log(tds.html());
                        commune_code = $('td:nth-child(4)', table).html();
                        commune_name = $('td:nth-child(5)', table).html();
                        console.log(commune_name);
                        criterion_1 = parseInt($('td:nth-child(9)', table).html());
                        criterion_2 = parseInt($('td:nth-child(10)', table).html());
                        criterion_3 = parseInt($('td:nth-child(11)', table).html());
                        result = parseInt($('td:nth-child(12)', table).html());
                        console.log(criterion_1, criterion_2, criterion_3, result);
                        // var children = table.children('tbody');
                        // var td_outer = children.children('td');
                        // console.log(td_outer.html());
                        if (! tds.html() == "") {
                            d3_construct_chart(criterion_1, criterion_2, criterion_3, result);
                            create_popup(commune_name, commune_code);
                            console.log("lnglat: " + lnglat);
                            update_street_view(lnglat);  
                        }
                        
                        }
                };
                xhttp.open("GET", url, true);
                xhttp.send();




            // --------------------------------------------- 

            // -------------- D3.js --------------------

            var d3_construct_chart = function(criterion_1, criterion_2, criterion_3, result){
            // Get the images corresponding the criteria chosen by the user for the popup icons
                var img1 = "/static/images/" + criteria_list[0] + ".png";
                var img2 = "/static/images/" + criteria_list[1] + ".png";
                var img3 = "/static/images/" + criteria_list[2] + ".png";
                var img4 = '/static/images/9.png';
                console.log(img1, img2, img3, img4);



            data = [
                {img:img1, value:criterion_1},
                {img:img2, value:criterion_2},
                {img:img3, value:criterion_3},
                {img:img4, value:result},
            ];


            var div = d3.select("#canvas-d3").append("div").attr("class", "toolTip-d3");

            var axisMargin = 20,
                    margin = 30,
                    valueMargin = 4,
                    width = parseInt(d3.select('#canvas-d3').style('width'), 10),
                    height = parseInt(d3.select('#canvas-d3').style('height'), 10),
                    barHeight = (height-axisMargin-margin*2)* 0.4/data.length,
                    barPadding = (height-axisMargin-margin*2)*0.6/data.length,
                    data, bar, svg, scale, xAxis, labelWidth = 0;

            max = d3.max(data, function(d) { return d.value; });

            svg = d3.select('#canvas-d3')
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("fill", "black");


            bar = svg.selectAll("g")
                    .data(data)
                    .enter()
                    .append("g");

            bar.attr("class", "bar")
                    .attr("cx",0)
                    .attr("transform", function(d, i) {
                        return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
                    });


            bar.attr("fill", function(d) {
                if (parseInt(d.value) > 200) {
                    console.log("green");
                  return "#008837";
                } else if (parseInt(d.value) <= 200 && parseInt(d.value) > 150) {
                    console.log("orange");
                  return "#6ebf7c";
                } else if (parseInt(d.value) <= 150 && parseInt(d.value) > 100) {
                    console.log("orange");
                  return "#aa7ebb";
                } else{
                    console.log("red");
                    console.log(d.value);
                    return "#7b3294";

                }
              });

            bar.attr("opacity", 0.92);



            bar.each(function(d,i){
                d3.select(this)
                    .append('image')
                          .attr('xlink:href', data[i].img)
                          .attr("y", (barHeight / 2) - 18)
                          .attr("x", -44)
                          .attr("id", 'cr'+i)
                          .attr('width',36)
                          .attr('height',36);
              });




            scale = d3.scale.linear()
                    .domain([0, max])
                    .range([0, width - margin*2 - 52]);

            xAxis = d3.svg.axis()
                    .scale(scale)
                    .tickSize(-height + 2*margin + axisMargin)
                    .orient("bottom");

            bar.append("rect")
                    .attr("transform", "translate("+labelWidth+", 0)")
                    .attr("height", barHeight)
                    .attr("width", function(d){
                        return scale(d.value);
                    });

            bar.append("text")
                    .attr("class", "value")
                    .attr("y", barHeight / 2)
                    .attr("dx", -valueMargin + labelWidth) //margin right
                    .attr("dy", ".35em") //vertical align middle
                    .attr("text-anchor", "end")
                    .attr("fill", function(d){
                        if (parseInt(d.value) < 15) {
                            return "#fff";
                        } else{
                            console.log(d.value);
                            return "#fff";
                        }
                    })
                    .text(function(d){
                        if (parseInt(d.value) < 20) {
                            return (d.value);
                        } else{
                            return (d.value+"/255");
                        }
                    })                    
                    .attr("x", function(d){
                        var width = this.getBBox().width;
                        return Math.max(width + valueMargin, scale(d.value));
                    });

            bar
                    .on("mousemove", function(d){
                        div.style("left", d3.event.pageX+10+"px");
                        div.style("top", d3.event.pageY-25+"px");
                        div.style("display", "inline-block");
                        div.html((d.label)+"<br>"+(d.value)+" sur 255");
                    });
            bar
                    .on("mouseout", function(d){
                        div.style("display", "none");
                    });

            svg.insert("g",":first-child")
                    .attr("class", "axisHorizontal")
                    .attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - axisMargin - margin)+")")
                    .call(xAxis);
            canvas_html = $('#canvas-d3').html();
            // console.log(canvas_html);

            console.log("The d3 part");

        };

        // -----------------------End of d3.js part ----------------------

        // ----------------------- Create Popup ---------------------------

           var create_popup = function(commune_name, commune_code){
            $('#popup').attr('title', commune_name + ', ' + commune_code);
             // Popup showing the position the user clicked
            var popup = new ol.Overlay({
                element: document.getElementById('popup'),
                autoPan: true,
                autoPanAnimation: {
                duration: 450
                },
            });
            map.addOverlay(popup);
            element = popup.getElement();
            var coordinate = evt.coordinate;
            var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
            coordinate, 'EPSG:3857', 'EPSG:4326'));
            // $(element).popover('destroy');
            popup.setPosition(coordinate);
            popup.setOffset([-220, 0]);
            // the keys are quoted to prevent renaming in ADVANCED mode.
            $(element).popover({
                'placement': 'top',
                // 'animation': false,
                'html': true,
                // 'content': 'You clicked near ' + hdms,
                'content': canvas_html,
            });
        // console.log($('#canvas-d3').html());
        console.log("The popup part");
        $(element).popover('show');
        $('#canvas-d3').html('');
        }

           }
           
           // ------------ End of create popup ----------

        } // ----------- End else if statement -----------

      });

    function update_street_view(coordinate) {
        //chercher le streetview le plus proche de POI
        // panorama.getPanorama({location: new google.maps.LatLng(coordinate[1], coordinate[0]), radius: 50}, processSVData);
        sv.getPanorama({location: new google.maps.LatLng(coordinate[1], coordinate[0]), radius: 100}, function (data, status) {
                                    if (status == google.maps.StreetViewStatus.OK) {
                                    //positioner le street view vers le panorama trouver
                                    panorama.setPosition(data.location.latLng);
                                    //chercher l'angle entre le POI et le panorama trouver
                                    // var angle=computeAngle(markerPOI2.getPosition(),panorama.getPosition());
                                    //changer l'angle "heading" de panorama pour qu'il se fixe vers le POI
                                    // panorama.setPov({
                                    //             heading: angle,
                                    //             pitch: 0,
                                    //             zoom:1
                                    //           });
                                    }
        }); //fin de chercher de streetview
        // panorama.setPosition(new google.maps.LatLng(coordinate[1], coordinate[0]));
    }

// ------------------------- End Map Click Event -----------------------------
    
    // prohobit the submit button from refresh the page
    $("form").submit(function(e) {
        e.preventDefault();
        });

    // Handle the submission of the first form
    $("#submit1").click(function() {

        // Get a list of the checked criteria
        criteria_list = [];
        criteria_names_list = [];
        $('input[type=checkbox]').each(function () {
            if (this.checked) {
                criteria_list.push(this.value);
                var name = this.name;
                console.log(name);
                var text = $('label[for=' + name + ']').text(); 
                criteria_names_list.push(text)
            }
        });

        console.log(criteria_list);
        console.log(criteria_names_list);

        // Check if the user hac selected exactly three criteria
        if (criteria_list.length === 3) { 

            // Set the title attribute for the labels to use them to show the tooltips
            $('#c1-1').attr("title", criteria_names_list[0]);
            $('#c1-2').attr("title", criteria_names_list[0]);
            $('#c2-1').attr("title", criteria_names_list[1]);
            $('#c2-2').attr("title", criteria_names_list[1]);
            $('#c3-1').attr("title", criteria_names_list[2]);
            $('#c3-2').attr("title", criteria_names_list[2]);

            // Set the src attribute of the image elements for the icons
            $('#c1-1 > img').attr("src", "/static/images/" + criteria_list[0] + "_64.png");
            $('#c1-2 > img').attr("src", "/static/images/" + criteria_list[0] + "_64.png");
            $('#c2-1 > img').attr("src", "/static/images/" + criteria_list[1] + "_64.png");
            $('#c2-2 > img').attr("src", "/static/images/" + criteria_list[1] + "_64.png");
            $('#c3-1 > img').attr("src", "/static/images/" + criteria_list[2] + "_64.png");
            $('#c3-2 > img').attr("src", "/static/images/" + criteria_list[2] + "_64.png");

            // Check if the user has selected the first criterion
            console.log("criteria_list includes 0 ? " + criteria_list.includes(0));
            if (criteria_list.includes('0')) {
                first_criterion = true;
                $('#panel-1').slideUp(600);
                setTimeout(function() {
                    $('#panel-4').slideDown(800);
                    console.log("panel 4 should appeeeeear");
                }, 600);
                console.log("panel 4 should appear");
            } else {

            $('#panel-1').slideUp(600);
            setTimeout(function() {
                $('#panel-2').slideDown(800);
            }, 600);

            }
        } else {
            $('#warning-1').fadeIn(400);
        }

    });


        // mapping the values of the sliders with sentences
        function value_to_sentence(value) {
            switch(value) {
                    case 1:
                        return " est extrêmement plus important que "
                        break;
                    case 2:
                        return " est très fortement plus important que "
                        break;
                    case 3:
                        return " est fortement plus important que "
                        break;
                    case 4:
                        return " est modérément plus important que "
                        break;
                    case 5:
                        return " est aussi important que "
                        break;
                    case 6:
                        return " est modérément moins important que "
                        break;
                    case 7:
                        return " est fortement moins important que "
                        break;
                    case 8:
                        return " est très fortement moins important que "
                        break;
                    case 9:
                        return " est extrêmement moins important que "
                        break;

                }
        };


        // Sliders
        $('#slider1').bootstrapSlider({
            formatter: function(value) {
                
                return "Critère à gauche" + value_to_sentence(value) + "critère à droite"
            }
        });

        $('#slider2').bootstrapSlider({
            formatter: function(value) {
                
                return "Critère à gauche" + value_to_sentence(value) + "critère à droite"
            }
        });

        $('#slider3').bootstrapSlider({
            formatter: function(value) {
                
                return "Critère à gauche" + value_to_sentence(value) + "critère à droite"
            }
        });


        // Handle the second submit
        $("#submit2").click(function() {
            console.log(map);
            $('#panel-2').slideUp(600);
            setTimeout(function() {
                $('#panel-3').fadeIn(800);
                console.log("panel-3");
            }, 600);

            $('input[type=text]').each(function () {
                console.log("compare " + this.value);
                comparison_list.push(this.value);
                console.log("slider value: " + this.value);
            });

            // Send the results to the server
            $.ajax({
                url: '/ajax/aide_criteria/',
                type: 'GET',
                data: {
                    'user_id' : user_id,
                    'cr1_id' : parseInt(criteria_list[0]) + 1,
                    'cr2_id' : parseInt(criteria_list[1]) + 1,
                    'cr3_id' : parseInt(criteria_list[2]) + 1,
                    'cr1-cr2' : comparison_list[0],
                    'cr2-cr3' : comparison_list[1],
                    'cr1-cr3' : comparison_list[2],
                }
            });




            // Add the vector layer
            map.addLayer(untiled);


            // Set the title attribute for the labels to use them to show the tooltips
            $('#cr-1').attr("title", criteria_names_list[0]);
            $('#cr-2').attr("title", criteria_names_list[1]);
            $('#cr-3').attr("title", criteria_names_list[2]);

        });




     // Create a map variable
     var map2;
     // Initialize the map
     function initMap() { // start initMap function
       // Use a constructor to create a new map JS object
        map2 = new google.maps.Map(document.getElementById('map2'), {
        center: map_center,
        zoom: 13,
        styles: [{
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [  { visibility: "off" }]
                    }],
        mapTypeId: google.maps.MapTypeId.HYBRID
        });
        sv = new google.maps.StreetViewService();
        map2.setOptions({ draggableCursor: 'crosshair' });
         // Different zoom for mobile devices
        if ($('.navbar').css('top') == '-60px') {
            map2.setZoom(13); // for mobile
        }

        // Street view new
        var lyon = {lat: 45.759618, lng: 4.828444};
        panorama = new google.maps.StreetViewPanorama(
          document.getElementById('panorama'), {
            position: lyon,
            pov: {
              heading: 300,
              pitch: 10
            }
          });
        map2.setStreetView(panorama);






        function addLatLng(event) {
          // Add a new marker at the new plotted point
          marker.setPosition(event.latLng);
          marker.setMap(map);
        }

        // Add a listener for the click event
        google.maps.event.addListener(map2, 'click', function(event) {
            if (clickable) {
                var marker = new google.maps.Marker({animation: google.maps.Animation.DROP});
                marker.setPosition(event.latLng);
                marker.setMap(map2);
                user_markers.push(marker);
                lat = marker.getPosition().lat();
                lng = marker.getPosition().lng();
                // Add the coordinates to the arrays
                user_centers_lat.push(lat);
                user_centers_lng.push(lng);
                console.log(user_markers);
                // Hide the first panel for tablet and mobile devices
                if ($('#btn-quart').css('font-size') == '22px' ||
                    $('.navbar').css('top') == '-60px') {
                    $('#panel-1').slideUp(400);
                }
                // Show the second panel for all devices
                $('#panel-4').slideUp(600);
                setTimeout(function() {
                    $('#panel-2').slideDown(600);
                    $("#drop-audio").get(0).play();
                }, 600);
                clickable = false;
                map2.setOptions({ draggableCursor: 'default' });
        }
        });

        var infowindow = new google.maps.InfoWindow({
        content: "<div class='container-fluid'><div class='panel panel-primary'><div class='panel .panel-heading'>Bealieu</div><div class='panel panel-body'>C'est le centre du quartier de <b style='color: red'>Beaulieu</b><br><br><button class='btn btn-success'>Continue</button></div><iframe src='https://coursera.org'></iframe></div></div>"

       });

         } // end initMap function

