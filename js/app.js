/*
			This file contains the view model, json loading, and some helper functions. 

*/



var vm = new Vue({
	el: '.app',
	data: {
		intro: true,
		showRandom: false,
		species: null,
		vernacular: null,
		scientific: null,
		countries: null,
		threats: null,
		imgSrc: '',
		excerpt: null,
		showThreats: false,
		showCountries: false,
		kingdom: null,
		phylum: null,
		klass: null,
		order: null,
		family: null,
		genus: null,
		vetted: [
			'red panda',
			'Eulemur flavifrons',
			'Lipotes vexillifer',
			'Gymnobelideus leadbeateri',
			'Canis rufus',
			'Mustela lutreola',
			'Phocoena sinus'


		]

	},
	methods: {
		next: function(message) {
			// var item = ;
			var dog = new Species(this.vetted[Math.floor(Math.random()*this.vetted.length)])
		}
	}
	// watch: {
	// 	species: function(newSpecies, old) {
	// 		//to work with changes in someOtherProp
	// 		this.threats = newSpecies.threats;
	// 		this.countries = newSpecies.countries;
	// 		console.log('changing' + newSpecies)
	// 	},
	// 	'species.countries': function(newVal, oldVal) {
	// 		//to work with changes in prop
	// 	}
	// }
})

// speciesData = [{
// 	name: 'bear',
// 	category: 'not threatened'
// }, {
// 	name: 'monkey',
// 	category: 'not THAT threatened'
// }]

var countryCodes, redListCountries;
window.onload = function() {
	$.getJSON("countryCodes.json", function(json) {
		countryCodes = {}

		json.forEach(function(x) {
			countryCodes[x['alpha-2']] = [x['alpha-3'], x['sub-region']];
		})
	});

	// var redListCountriesRaw;
	$.getJSON("redListCountries.json", function(json) {
		// redListCountriesRaw = json;
		redListCountries = {}
		json['results'].forEach(function(x) {
			redListCountries[x.country] = x.isocode;
		})
	})

	highlightCountries([]);

	// love = new Species('red panda');
	var panda = new Species('eastern gorilla');
	vm.species = panda;


}



// function ViewModel() {
// 	self = this;

// 	this.species = ko.observableArray([]);

// 	speciesData.forEach(function(babeData) {
// 		//self.species.push(new Species(babeData))
// 	})

// 	this.currentSpecies = ko.observable(this.species[0]);

// 	this.wikiList = ko.observableArray([]);


// }

// // Activates knockout.js
// app = new ViewModel()
// ko.applyBindings(app);


// $.ajax('https://en.wikipedia.org/w/api.php?action=query')



// function wikiSpecies(speciesStr) {
// 	var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + speciesStr + "&format=json&callback=wikiCallback";

// 	$.ajax({
// 		url: wikiUrl,
// 		dataType: "jsonP",
// 		success: function(response) {
// 			console.log(response);
// 			app.wikiList.removeAll()
// 			response[1].forEach(function(s) {
// 				app.wikiList.push({
// 					name: s,
// 					url: 'https://en.wikipedia.org/wiki/' + s
// 				});
// 			});
// 		}
// 	});
// };

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