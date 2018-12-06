var server = require("../../main.js");
var consoleTable = require("console.table");

function main(req, res){
	server.extractJSONFromRequest(req).then(function(data){
		res.setHeader('Content-Type', 'application/json');
		
		for(let i in server.users){
			if(data.id == server.users[i].id){
				
				res.end( JSON.stringify(server.users[i]) );
			}
		}
		
		res.end("Could not find a user with the id " + data.id);
	});
}
module.exports.main = main;