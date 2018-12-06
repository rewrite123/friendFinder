var server = require("../../main.js");
var consoleTable = require("console.table");

function main(req, res){
	server.extractJSONFromRequest(req).then(function(data){
		//console.table(data);
		var nu = new server.User(data.first, data.last, data.gender, data.additional);
		nu.properties = data.properties;
		server.users.push(nu);
		res.end( JSON.stringify(nu) );
	});
}
module.exports.main = main;