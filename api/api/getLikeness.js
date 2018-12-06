var server = require("../../main.js");
var consoleTable = require("console.table");

function main(req, res){
	server.extractJSONFromRequest(req).then(function(data){
		res.setHeader('Content-Type', 'application/json');
		
		var sorted = server.users.slice(0);
		sorted.sort(function(a, b){
			return getLikeness(a, data)-getLikeness(b, data);
		});
		res.end( JSON.stringify(sorted) );
	});
}
module.exports.main = main;

function getLikeness(obj, comp){
	var totals = {
		nerdyness: 		Math.abs(obj.properties.nerdyness-comp.properties.nerdyness),
		outgoingness: 	Math.abs(obj.properties.outgoingness-comp.properties.outgoingness),
		coolness: 		Math.abs(obj.properties.coolness-comp.properties.coolness),
		athleticism: 	Math.abs(obj.properties.athleticism-comp.properties.athleticism),
		quirkyness:		Math.abs(obj.properties.quirkyness-comp.properties.quirkyness),
		openness: 		Math.abs(obj.properties.openness-comp.properties.openness),
		awesomeness: 	Math.abs(obj.properties.awesomeness-comp.properties.awesomeness),
		smartness: 		Math.abs(obj.properties.smartness-comp.properties.smartness),
		artness: 		Math.abs(obj.properties.artness-comp.properties.artness),
		cooking: 		Math.abs(obj.properties.cooking-comp.properties.cooking)
	};
	return totals.nerdyness+totals.outgoingness+totals.coolness+totals.athleticism+totals.quirkyness+totals.openness+totals.awesomeness+totals.smartness+totals.artness+totals.cooking;
}