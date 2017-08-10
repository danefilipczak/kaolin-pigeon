// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
speciesData = [
		{
			name:'bear',
			category:'not threatened'
		},{
			name:'monkey',
			category:'not THAT threatened'
		}]



function ViewModel() {
	self = this;

	this.species = ko.observableArray([]);

	speciesData.forEach(function(babeData){
		self.species.push(new Species(babeData))
	})

    this.currentSpecies = ko.observable(this.species[0]);

    this.wikiList = ko.observableArray([]);
    
   
}

// Activates knockout.js
app = new ViewModel()
ko.applyBindings(app);


// $.ajax('https://en.wikipedia.org/w/api.php?action=query')

function getSpeciesByCountry(country){
	var url = 'http://apiv3.iucnredlist.org/api/v3/country/getspecies/'
	+ country 
	+ '?token=9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee';
	$.ajax({
		url: url,
		// dataType: "jsonP",
		success: function(response){
			var filtered = response.result.filter(function (a) {
			    return a.category === 'EN';
			});
			console.log(filtered);
		}
	});

}


function wikiSpecies(speciesStr){
	var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" 
	+ speciesStr 
	+ "&format=json&callback=wikiCallback";

	$.ajax({
		url: wikiUrl,
		dataType: "jsonP",
		success: function(response){
			console.log(response);
			app.wikiList.removeAll()
			response[1].forEach(function(s){
				app.wikiList.push({
					name: s,
					url: 'https://en.wikipedia.org/wiki/' + s
				});
			});
		}
	});
};
