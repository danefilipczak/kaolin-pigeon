/*
			This file contains the view model, json loading, and some helper functions. 

*/


/*


TO DO:
-two way transitions on expansion
bind threat and regions data
navigation screen

remove all google maps button

re-instate habitats and regions buttons 

real navigation 

clik back to species from another leve of taxonoy

*/


var vm = new Vue({
	el: '.app',
	data: {
		intro: true,
		shadowBox:false,
		spiels: {},
		showRandom: false,
		// species: null,
		vernacular: null,
		scientific: null,
		countries: null,
		threats: null,
		imgSrc: null,
		species:null,
		excerpt: null,
		threatCheck: false,
		countryCheck: false,
		habitatCheck: false,
		regionCheck:false,
		kingdom: null,
		phylum: null,
		klass: null,
		order: null,
		family: null,
		genus: null,
		habitats:['forest', 'stream'],
		regions:['up', 'down', 'all around'],
		aside: '',
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
	computed: {

		showCountries: function() {
			this.regionCheck = false;
			this.threatCheck = false;
			this.habitatCheck = false;
			// this.countryCheck = !this.countryCheck;
			return this.countryCheck
		},
		// showThreats: function() {
		// 	this.regionCheck = false;
		// 	this.countryCheck = false;
		// 	this.habitatCheck = false;
		// 	return this.threatCheck;
		// }

	},
	methods: {
		showThreats: function(){

			vm.countryCheck=false;
			vm.habitatCheck=false;
			vm.regionCheck = false;

			if(this.threatCheck==true){
				this.aside = 'threats'
			} else {
				// console.log('erasing aside')
				this.aside = '';
			}
			
		},
		showCountries: function(){

			vm.threatCheck=false;
			vm.habitatCheck=false;
			vm.regionCheck = false;

			if(this.countryCheck==true){
				this.aside = 'countries'
			} else {
				// console.log('erasing aside')
				this.aside = '';
			}
			
		},
		showHabitats: function(){

			vm.threatCheck=false;
			vm.countryCheck=false;
			vm.regionCheck = false;

			if(this.habitatCheck==true){
				this.aside = 'habitats'
			} else {
				// console.log('erasing aside')
				this.aside = '';
			}
			
		},

		showRegions: function(){

			vm.threatCheck=false;
			vm.countryCheck=false;
			vm.habitatCheck = false;

			if(this.regionCheck==true){
				this.aside = 'regions'
			} else {
				// console.log('erasing aside')
				this.aside = '';
			}
			
		},
		toggleShadow: function() {

			this.shadowBox = !this.shadowBox;

		},
		showSpiel: function(taxonType){

			this.excerpt = this.spiels[taxonType];
			$('.excerpt').scrollTop(0);

		},
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