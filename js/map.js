var map;

// function initMap(){
// 	$('#map')[0]
// 	map = new google.maps.Map(document.getElementById('map'), {
// 		center: {lat: 40.8674958, lng: -73.8374625},
// 		zoom: 13
// 	});
// 	console.log('h')

// }

function highlightCountries(countryArray){
	/*
	Takes a string or an array of strings and highlight them on the map.
	Note that this only works because both arrays and strings accept the 'includes' method, which is pretty cool
	*/

	//convert country array to iso2 array from redlist data
	var iso2Array = [];
	countryArray.forEach(function(c){
		iso2Array.push(redListCountries[c])
	})

	//converto iso2 array to iso 3 array from country codes data
	var iso3Array = [];
	iso2Array.forEach(function(c){
		iso3Array.push(countryCodes[c][0])
	})
	//console.log(iso3Array)



	map.data.setStyle(function(feature) {
		// var id = feature.getProperty('id');
		var id = feature.j;
		//console.log(feature.j)
		//var visible = name == "Switzerland" ? true : false;
		var visible = false;
		if(iso3Array.includes(id)){
			visible = true;
		}
		return {
			visible: visible,
			fillColor: 'olive',
			fillOpacity: 0.69,
			strokeWeight: 0
		};
	});
}

function iso3ToIso2(iso3) {
	var res;
	countryCodes.forEach(function(ob) {
		if (ob['alpha-3'] == iso3) {
			res = ob['alpha-2'];
		}
	})
	return res;
}

function iso2ToIso3(iso2) {
	var res;
	countryCodes.forEach(function(ob) {
		if (ob['alpha-2'] == iso2) {
			res = ob['alpha-3'];
		}
	})
	return res;
}


function initMap() {
	styles = [{
		featureType: "all",
		elementType: "labels",
		stylers: [{
			// visibility: "off"
		}]
	}, {
		"featureType": "water",
		"elementType": "all",
		"stylers": [{
			"hue": "green"
		}, {
			"saturation": 00
		}, {
			"lightness": -100
		}, {
			"visibility": "on"
		}]
	}, {
		"featureType": "landscape",
		"elementType": "all",
		"stylers": [{
                "color": "#000000"
            },
            {
                "lightness": 50
            }]
	}, {
		"featureType": "poi",
		"elementType": "all",
		"stylers": [{
			"hue": "red"
		}, {
			"saturation": 100
		}, {
			"lightness": -46
		}, {
			"visibility": "off"
		}]
	}, {
		"featureType": "road.local",
		"elementType": "all",
		"stylers": [{
			"hue": "#CC79A7"
		}, {
			"saturation": -55
		}, {
			"lightness": -36
		}, {
			"visibility": "on"
		}]
	}, {
		"featureType": "road.arterial",
		"elementType": "all",
		"stylers": [{
			"hue": "#F0E442"
		}, {
			"saturation": -15
		}, {
			"lightness": -22
		}, {
			"visibility": "on"
		}]
	}, {
		"featureType": "road.highway",
		"elementType": "all",
		"stylers": [{
			"hue": "#56B4E9"
		}, {
			"saturation": -23
		}, {
			"lightness": -2
		}, {
			"visibility": "on"
		}]
	}, {
		"featureType": "administrative",
		"elementType": "geometry",
		"stylers": [{
			"hue": "#000000"
		}, {
			"saturation": 0
		}, {
			"lightness": -100
		}, {
			"visibility": "on"
		}]
	}, {
		"featureType": "transit",
		"elementType": "all",
		"stylers": [{
			"hue": "#009E73"
		}, {
			"saturation": 100
		}, {
			"lightness": -59
		}, {
			"visibility": "on"
		}]
	}];


	map = new google.maps.Map(document.getElementById('map'), {
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.BOTTOM_CENTER
		},
		center: {
			lat: -34.397,
			lng: 150.644
		},
		zoom: 3,
		styles: styles,
		// mapTypeId: 'hybrid'
	});
	map.data.loadGeoJson("js/world.geo.json");

	// map.data.setStyle({
	// 	//icon: '//example.com/path/to/image.png',
	// 	fillColor: 'green'
	// });

	// map.data.setStyle(function(feature) {
	// 	var name = feature.getProperty('name');
	// 	//console.log()
	// 	var visible = name == "Switzerland" ? true : false;
	// 	return {
	// 		visible: visible,
	// 		fillColor:'red',
	// 		fillOpacity: 1,
	// 		strokeWeight: 0
	// 	};
	// });



	//     var centerControlDiv = $('.main')[0];
	// var centerControl = new google.CenterControl(centerControlDiv, map);

	// centerControlDiv.index = 1;
	map.controls[google.maps.ControlPosition.TOP_CENTER].push($('.main')[0]);
}


// $("#species").mouseleave(function() {
// 	$("#map")[0].focus();
// 	console.log('speciesleave')
// 	$('#pic').animate({
// 		width: 0
// 	}, 618)
// });


// $("#species").mouseenter(function() {
// 	$("#map")[0].focus();
// 	console.log('speciesover')
// 	width = window.innerWidth;
// 	$('#pic').animate({
// 		width: width
// 	}, 618);

// });