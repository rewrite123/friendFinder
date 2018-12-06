const http = require("http");
const url = require("url");

const consoleTable = require("console.table");

const fs = require("fs");

var host = "localhost";
var port = process.env.port || 80;

var index = {
	html:	[],
	css:	[],
	js: 	[],
	media: 	[],
	readdir:[],
	api:	[]
};

function initIndex(){
	var htmlPath = __dirname + "/html";
	fs.readdir(htmlPath, function(err, files){
		for(let i in files){
			var f = fs.statSync(__dirname+"/html/"+files[i]);
			if(f.isFile()){
				if(files[i].includes(".html") && !files[i].includes("~")){
					index.html.push({path: __dirname+"/html/"+files[i], serv: files[i].replace(".html", "")});
				}
			}else if(f.isDirectory()){
				initIndexHtmlHelper(__dirname+"/html/"+files[i]);
			}
		}
	});
	
	var cssPath = __dirname + "/css";
	fs.readdir(cssPath, function(err, files){
		for(let i in files){
			var f = fs.statSync(__dirname+"/css/"+files[i]);
			if(f.isFile()){
				if(files[i].includes(".css") && !files[i].includes("~")){
					index.css.push({path: __dirname+"/css/"+files[i], serv: files[i]});
				}
			}else if(f.isDirectory()){
				initIndexCssHelper(__dirname+"/css/"+files[i]);
			}
		}
	});
	
	var jsPath = __dirname + "/js";
	fs.readdir(jsPath, function(err, files){
		for(let i in files){
			var f = fs.statSync(__dirname+"/js/"+files[i]);
			if(f.isFile()){
				if(files[i].includes(".js") && !files[i].includes("~")){
					index.js.push({path: __dirname+"/js/"+files[i], serv: files[i]});
				}
			}else if(f.isDirectory()){
				initIndexJsHelper(__dirname+"/js/"+files[i]);
			}
		}
	});
	
	var mediaPath = __dirname + "/media";
	fs.readdir(mediaPath, function(err, files){
		for(let i in files){
			var f = fs.statSync(__dirname+"/media/"+files[i]);
			if(f.isFile()){
				if(!files[i].includes("~") && !files[i].includes("DS_Store") ){
					index.media.push({path: __dirname+"/media/"+files[i], serv: files[i]});
				}
			}else if(f.isDirectory()){
				initIndexMediaHelper(__dirname+"/media/"+files[i]);
			}
		}
	});
	
	fs.readFile(__dirname + "/readdir", "utf8", function(err, res){
		var data = res.split("\n");
		for(let i in data){
			data[i] = data[i].replace(/\s+/g, " ");
			index.readdir.push({from: ""+data[i].split(" ")[0].trim(), to: ""+data[i].split(" ")[1].trim() });
		}
		//console.table(index.readdir);
	});
	
	var htmlPath = __dirname + "/api";
	fs.readdir(htmlPath, function(err, files){
		for(let i in files){
			var f = fs.statSync(__dirname+"/api/"+files[i]);
			if(f.isFile()){
				if(files[i].includes(".js") && !files[i].includes("~")){
					index.api.push({path: __dirname+"/api/"+files[i], serv: files[i].replace(".js", "")});
				}
			}else if(f.isDirectory()){
				initIndexApiHelper(__dirname+"/api/"+files[i]);
			}
		}
	});
	
}
initIndex();

function initIndexHtmlHelper(path){
	fs.readdir(path, function(err, files){
		for(let i in files){
			var f = fs.statSync(path+"/"+files[i]);
			if(f.isFile()){
				if(files[i].includes(".html") && !files[i].includes("~")){
					index.html.push({path: path+"/"+files[i], serv: (path.replace(__dirname+"/html/", "") + "/" + files[i]).replace(".html", "")});
				}
			}else if(f.isDirectory()){
				initIndexHtmlHelper(path+"/"+files[i]);
			}
		}
		//console.table(index.html);
	});
}

function initIndexCssHelper(path){
	fs.readdir(path, function(err, files){
		for(let i in files){
			var f = fs.statSync(path+"/"+files[i]);
			if(f.isFile()){
				if(files[i].includes(".css") && !files[i].includes("~")){
					index.css.push({path: path+"/"+files[i], serv: path+"/"+files[i]});
				}
			}else if(f.isDirectory()){
				initIndexCssHelper(path+"/"+files[i]);
			}
		}
		//console.table(index.css);
	});
}

function initIndexJsHelper(path){
	fs.readdir(path, function(err, files){
		for(let i in files){
			var f = fs.statSync(path+"/"+files[i]);
			if(f.isFile()){
				if(files[i].includes(".js") && !files[i].includes("~")){
					index.js.push({path: path+"/"+files[i], serv: path+"/"+files[i] });
				}
			}else if(f.isDirectory()){
				initIndexCssHelper(path+"/"+files[i]);
			}
		}
		//console.table(index.js);
	});
}

function initIndexMediaHelper(path){
	fs.readdir(path, function(err, files){
		for(let i in files){
			var f = fs.statSync(path+"/"+files[i]);
			if(f.isFile()){
				if(!files[i].includes("~") && !files[i].includes("DS_Store")){
					index.media.push({path: path+"/"+files[i], serv: path+"/"+files[i]});
				}
			}else if(f.isDirectory()){
				initIndexCssHelper(path+"/"+files[i]);
			}
		}
		//console.table(index.media);
	});
}

function initIndexApiHelper(path){
	fs.readdir(path, function(err, files){
		for(let i in files){
			var f = fs.statSync(path+"/"+files[i]);
			if(f.isFile()){
				if(files[i].includes(".js") && !files[i].includes("~")){
					index.api.push({path: path+"/"+files[i], serv: (path.replace(__dirname+"/api/", "") + "/" + files[i]).replace(".js", "")});
				}
			}else if(f.isDirectory()){
				initIndexHtmlHelper(path+"/"+files[i]);
			}
		}
		//console.table(index.api);
	});
}

function extractJSONFromRequest(req){
	var prom = new Promise(function(resolve, reject){
		var jsonString = '';
		req.on('data', function (data) {
			jsonString += data;
		});
		req.on('end', function () {
			resolve(JSON.parse(jsonString));
		});
	});
	
	return prom;
}
module.exports.extractJSONFromRequest = extractJSONFromRequest;

const server = http.createServer(function(req, res){
	
	var triggered = false;
	
	var pathname = url.parse(req.url).pathname;
	for(let i in index.html){
		if("/"+index.html[i].serv == pathname){
			triggered = true;
			res.statusCode = 200;
			res.setHeader("Content-Type", "text/html");
			res.end(fs.readFileSync(index.html[i].path));
		}
	}
	for(let i in index.css){
		if("/"+index.css[i].serv == pathname){
			triggered = true;
			res.statusCode = 200;
			res.setHeader("Content-Type", "text/css");
			res.end(fs.readFileSync(index.css[i].path));
		}
	}
	for(let i in index.js){
		if("/"+index.js[i].serv == pathname){
			triggered = true;
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/javascript");
			res.end(fs.readFileSync(index.js[i].path));
		}
	}
	for(let i in index.media){
		if("/"+index.media[i].serv == pathname){
			triggered = true;
			res.statusCode = 200;
			res.end(fs.readFileSync(index.media[i].path));
		}
	}
	for(let i in index.readdir){
		if(index.readdir[i].from == pathname){
			triggered = true;
			res.writeHead(302, {Location: index.readdir[i].to.trim()});
			res.end();
		}
	}
	if(req.method.toLowerCase() == "post"){
		for(let i in index.api){
			if("/"+index.api[i].serv == pathname){
				triggered = true;
				var required = require(index.api[i].path);
				required.main(req, res);
				//res.end();
			}
		}
	}
	
	if(!triggered){
		res.end("<h1>404: Sorry, but we couldn't find that page.</h1>");
	}
});

server.listen(port, host, function(){
	console.log("Server hosted on " + host + ":" + port);
});

/* This is where all the non boilerplate stuff goes. */

var users = [];
module.exports.users = users;

var User = function(){
	this.id			=	(new Date()).getTime();
	this.first		=	arguments[00] || "Firstname";
	this.last 		=	arguments[01] || "Lastname";
	this.gender 	=	arguments[02] || "Kadabra used confuse... It was super effective!";
	this.additional	= 	arguments[03] || "This person unfortunately has nothing extra to say ¯\\_(ツ)_/¯";
	this.properties	= {
		nerdyness	:	arguments[04] || 0,
		outgoingness:	arguments[05] || 0,
		coolness	:	arguments[06] || 0,
		athleticism	:	arguments[07] || 0,
		quirkyness	:	arguments[08] || 0,
		openness	:	arguments[09] || 0,
		awesomeness	:	arguments[10] || 0,
		smartness	:	arguments[11] || 0,
		artness		:	arguments[12] || 0,
		cooking		:	arguments[13] || 0
	};
}
module.exports.User = User;
