/*
			This file contains the object model for the a single species, and the data it contains. 
			It includes many methods for fetching information about the species from wikipedia or ICUN redlist. 
*/
var token = '0a12c7a6e9b5ec8e06ced309eabbcba8fdb24b32b16a85e76f820e9c2b6d5b72'

function Species(input) {

	var strictBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(85 * 0.7, -180 * 0.7), // top left corner of map
		new google.maps.LatLng(-85 * 0.7, 180 * 0.7) // bottom right corner
	);

	map.fitBounds(strictBounds);

	vm.species = null;
	vm.excerpt = null;
	vm.scientific = null
		// species: null,
	vm.vernacular = null;
	vm.scientific = null;
	vm.countries = null;
	vm.threats = null;
	vm.imgSrc = null;
	vm.excerpt = null;
	vm.kingdom = null;
	vm.phylum = null;
	vm.klass = null;
	vm.order = null;
	vm.genus = null;
	vm.family = null;

	var self = this;
	this.input = input;

	/*
		The 'input' paramater to this object can be either a vernacular name or a scientific name. 
		Therefore, the first tast is to link up on a set of names that both wikipedia and red list accept


		1: query wikipedia with given info including redirects(yeilding wiki compatable/vernacular)
		then simoltaneously:
		2a: do the wiki querries (img and excerpt)
		2b: try to make first redlist query (taxonomy) with user info. 
		2 if red list doesn't recognize, query wiki redicts list on resolved wikiendpoint from step 1. 
		//iterate through redirects list until you find one that spits red list data (usually the first). 


	*/



	//1



	self.imgPath;
	self.excerpt;
	self.taxonomy;

	this.getWikiEndpoint(this.input);


	this.redirects = 0;

	vm.species = this;

}


// function getSpeciesByCountry(country) {
// 	var url = 'http://apiv3.iucnredlist.org/api/v3/country/getspecies/' + country + '?token=9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee';
// 	$.ajax({
// 		url: url,
// 		// dataType: "jsonP",
// 		success: function(response) {
// 			var filtered = response.result.filter(function(a) {
// 				return a.category === 'EN';
// 			});
// 			console.log(filtered);
// 		}
// 	});

// }


Species.prototype.getTaxonomy = function(species) {
	var self = this;
	var url = "http://apiv3.iucnredlist.org/api/v3/species/" + species + "?token=" + token;
	$.ajax({
		url: url,
		// dataType: "jsonP",
		success: function(response) {
			// var filtered = response.result.filter(function(a) {
			// 	return a.category === 'EN';
			// });
			// var raw = response.result;
			// countries = [];
			// raw.forEach(function(r) {
			// 	countries.push(r.country);
			// })
			// self.countries = countries;
			console.log(response);
			try {
				if (response.result.length == 0) {
					//species not found under that name, try a redirect
					self.getWikiRedirects(self.vernacular);
					console.log('no species found under that name, querying redirects')
				} else {
					self.taxonomy = response.result;
					self.parseTaxonomy();
					self.scientific = response.name;
					vm.scientific = self.scientific;

					//the input is working fine with red list, continue making api calls
					self.getCountriesBySpecies(self.input);
					self.getThreatsBySpecies(self.input);
					self.getHabitatsBySpecies(self.input);
					console.log('found')
						//console.log(response);
						//self.taxonomy = new Taxonomy(result.response)
				}
			} catch (err) {
				console.log('it seems like red list doesn\'t have info on that species')
			}
			//console.log(countries);
		}
	});
}

Species.prototype.getCountriesBySpecies = function(species) {
	var self = this;
	var url = "http://apiv3.iucnredlist.org/api/v3/species/countries/name/" + species + "?token=" + token;
	$.ajax({
		url: url,
		// dataType: "jsonP",
		success: function(response) {
			// var filtered = response.result.filter(function(a) {
			// 	return a.category === 'EN';
			// });
			var raw = response.result;
			var countries = [];
			raw.forEach(function(r) {
				countries.push(r.country);
			})
			if (countries.length > 0) {
				self.countries = countries;
				self.setMap();
				vm.countries = self.countries;
				highlightCountries(countries)
			}
			//self.countries = countries;
			//console.log(countries);
		}
	});
}



Species.prototype.getHabitatsBySpecies = function(species) {
	var self = this;
	//returns an array of majorly import habitats.
	var url = 'http://apiv3.iucnredlist.org/api/v3/habitats/species/name/' + species + '?token=' + token;
	$.ajax({
		url: url,
		// dataType: "jsonP",
		success: function(response) {
			var filtered = response.result.filter(function(a) {
				return a.majorimportance === 'Yes';
			});
			// console.log(filtered);
			// console.log(response)
			if (response.result.length > 0) {
				self.habitats = response.result;
			}

		}
	});

}


Species.prototype.getThreatsBySpecies = function(species) {
	//returns an array of majorly import habitats.
	var self = this;
	var url = 'http://apiv3.iucnredlist.org/api/v3/threats/species/name/' + species + '?token=' + token;
	$.ajax({
		url: url,
		// dataType: "jsonP",
		success: function(response) {
			// var filtered = response.result.filter(function (a) {
			//     return a.severity != null;
			// });
			//filtering severity by null doesn't seem to be effective because it seems that they're using null to mean 'undefined', rather than 'no severity'
			//console.log(filtered);
			//console.log(response)
			if (response.result.length > 0) {
				self.threats = response.result;
				vm.threats = self.threats;
			}

		}
	});

}



Species.prototype.getWikiExcerpt = function(article) {
	var self = this;
	var url = 'https://en.wikipedia.org/w/api.php?&format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + article;
	$.ajax({
		url: url,
		dataType: "jsonp",
		success: function(r) {
			var pageId = r.query.pages;
			pageId = Object.keys(pageId)[0];
			var excerpt = r.query.pages[pageId].extract;

			self.excerpt = excerpt;
			vm.spiels['species'] = self.excerpt;
			vm.excerpt = vm.spiels.species;
		},
		error: function() {
			self.excerpt = 'Information on this species could not be retrieved.'
		}
	})
}

Species.prototype.getWikiImgSrc = function(articleName) {
	var self = this;
	//a multi-step process; first, query the page name and get a list of images, then make a second request to obtain the actual url of that image
	var url1 = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + articleName + '&prop=pageimages&format=json';
	$.ajax({
		url: url1,
		dataType: "jsonp",
		error: function() {
			self.imgError = "An image for the " + self.species + " could not be fetched."
		},
		success: function(r) {

			//extract the page ID from the reponse
			var pageId = r.query.pages;
			pageId = Object.keys(pageId)[0];
			//console.log(pageId)

			//then use it to get the img location
			var imgFile = r.query.pages[pageId].pageimage;
			// console.log(imgFile);
			// var url2 = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + imgFile + '&prop=imageinfo&iiprop=url&format=json'
			var url2 = "https://en.wikipedia.org/w/api.php?action=query&titles=Image:" + imgFile + "&prop=imageinfo&iiprop=url&format=json"
			$.ajax({
				url: url2,
				dataType: "jsonp",
				success: function(res) {
					var pageId = res.query.pages;
					pageId = Object.keys(pageId)[0];
					var path;
					try {
						path = res.query.pages[pageId].imageinfo[0].url;
					} catch (err) {
						console.log("couldn't load an image")
					}

					//console.log(res.query.pages[pageId].imageinfo);
					self.imgPath = path;
					vm.imgSrc = self.imgPath;
				},
				error: function() {
					self.imgError = "An image for the " + self.species + " could not be fetched."
				}
			});
		}
	})
};



Species.prototype.getWikiEndpoint = function(title) {
	//Follows wikipedia redirects and returns the final article endpoint. 
	//usefull for converting scientific names into vernacular names. 
	var self = this;
	// var url = 'https://en.wikipedia.org/w/api.php?&format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + article;
	var url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + title + '&redirects&format=json';
	$.ajax({
		url: url,
		dataType: "jsonp",
		success: function(r) {
			// var pageId = r.query.pages;
			// pageId = Object.keys(pageId)[0];
			// var excerpt = r.query.pages[pageId].extract;

			// self.excerpt = excerpt;
			var pageId = r.query.pages;
			pageId = Object.keys(pageId)[0];
			//console.log(r);
			//console.log(r.query.pages[pageId].title);
			self.vernacular = r.query.pages[pageId].title;
			vm.vernacular = self.vernacular;
			self.getWikiExcerpt(self.vernacular);
			self.getWikiImgSrc(self.vernacular);
			self.getTaxonomy(self.input);
		},
		error: function() {
			console.log('there was an error resolving wikipedia redirects')
		}
	})

}


Species.prototype.getWikiRedirects = function(title) {
	//Gets the pages that redirect to a certain article. Useful for deriving a scientific name from a vernacular. 
	var self = this;
	// var url = 'https://en.wikipedia.org/w/api.php?&format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + article;
	// var url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + title + '&redirects&format=json';
	var url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + title + '&prop=redirects&format=json';
	$.ajax({
		url: url,
		dataType: "jsonp",
		success: function(r) {
			// var pageId = r.query.pages;
			// pageId = Object.keys(pageId)[0];
			// var excerpt = r.query.pages[pageId].extract;

			// self.excerpt = excerpt;
			var pageId = r.query.pages;
			pageId = Object.keys(pageId)[0];
			//console.log(r);
			//console.log(r.query.pages[pageId].title);
			//console.log(r.query.pages[pageId].redirects[0].title)
			try {
				var scientific = r.query.pages[pageId].redirects[self.redirects].title;
				self.getTaxonomy(scientific);
				self.getCountriesBySpecies(scientific);
				self.getThreatsBySpecies(scientific);
				self.getHabitatsBySpecies(scientific);
			} catch (err) {
				console.log('can\'t find this species in redlist');
			}

			// self.getWikiExcerpt(self.vernacular);
			// self.getWikiImgSrc(self.vernacular);
			//self.getTaxonomy(self.input);

			self.redirects++;
		},
		error: function() {
			console.log('there was an error resolving wikipedia redirects')
		}
	})

}

Species.prototype.parseTaxonomy = function() {
	console.log('info for taxonomy parsing');
	console.log(this.taxonomy);
	vm.kingdom = this.taxonomy[0].kingdom.toLowerCase();
	this.getTaxonEndpoint('kingdom', vm.kingdom);
	vm.phylum = this.taxonomy[0].phylum.toLowerCase();
	this.getTaxonEndpoint('phylum', vm.phylum);
	vm.klass = this.taxonomy[0].class.toLowerCase();
	this.getTaxonEndpoint('class', vm.klass);
	vm.order = this.taxonomy[0].order.toLowerCase();
	this.getTaxonEndpoint('order', vm.order);
	vm.family = this.taxonomy[0].family.toLowerCase();
	this.getTaxonEndpoint('family', vm.family);
	vm.genus = this.taxonomy[0].genus.toLowerCase();
	this.getTaxonEndpoint('genus', vm.genus);
}

Species.prototype.getTaxonEndpoint = function(taxonType, title_) {
	//Follows wikipedia redirects and returns the final article endpoint. 
	//usefull for converting scientific names into vernacular names. 
	var self = this;
	// var url = 'https://en.wikipedia.org/w/api.php?&format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + article;
	var url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + title_ + '&redirects&format=json';
	$.ajax({
		url: url,
		dataType: "jsonp",
		success: function(r) {
			// var pageId = r.query.pages;
			// pageId = Object.keys(pageId)[0];
			// var excerpt = r.query.pages[pageId].extract;

			// self.excerpt = excerpt;
			var pageId = r.query.pages;
			pageId = Object.keys(pageId)[0];
			//console.log(r);
			//console.log(r.query.pages[pageId].title);
			// self.vernacular = r.query.pages[pageId].title;
			// vm.vernacular = self.vernacular;
			self.getTaxonExcerpt(r.query.pages[pageId].title, taxonType);
			// self.getWikiImgSrc(self.vernacular);
			// self.getTaxonomy(self.input);
		},
		error: function() {
			console.log('there was an error resolving wikipedia redirects')
		}
	})

}

Species.prototype.getTaxonExcerpt = function(article, taxonType) {
	var self = this;
	var url = 'https://en.wikipedia.org/w/api.php?&format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + article;
	$.ajax({
		url: url,
		dataType: "jsonp",
		success: function(r) {
			var pageId = r.query.pages;
			pageId = Object.keys(pageId)[0];
			var excerpt = r.query.pages[pageId].extract;

			// self.excerpt = excerpt;
			vm.spiels[taxonType] = excerpt;
		},
		error: function() {
			self.excerpt = 'Information on this species could not be retrieved.'
		}
	})
}

Species.prototype.getSpiel = function(taxonType, name) {

	// vm.spiels[taxonType] = ??
}

Array.prototype.flatten = function() {
	return this.reduce(function(c, x) {
		return Array.isArray(x) ? c.concat(x.flatten()) : c.concat(x);
	}, []);
}


Species.prototype.setMap = function() {
	var iso2Array = [];
	this.countries.forEach(function(c) {
		iso2Array.push(redListCountries[c])
	})

	//converto iso2 array to iso 3 array from country codes data
	var iso3Array = [];
	iso2Array.forEach(function(c) {
		iso3Array.push(countryCodes[c][0])
	})

	console.log('for mapppp')


	var countryPoints = [];
	iso3Array.forEach(function(c) {
		world.features.forEach(function(f) {
			if (f.id == c) {
				countryPoints.push(f.geometry.coordinates)
			}
		})
	})

	countryPoints = countryPoints.flatten();

	console.log(countryPoints);

	var bound = new google.maps.LatLngBounds();



	for (i = 0; i < countryPoints.length; i += 2) {
		bound.extend(new google.maps.LatLng(countryPoints[i + 1], countryPoints[i]));

		// OTHER CODE
	}
	map.fitBounds(bound);
}