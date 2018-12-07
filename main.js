const http = require("http");
const url = require("url");

const consoleTable = require("console.table");

const fs = require("fs");

var port = process.env.PORT || 80;

/* This holds arrays for all the files that we will be serving on our website. */
var index = {
	html:	[],
	css:	[],
	js: 	[],
	media: 	[],
	reddir:[],
	api:	[]
};

/* 
   This fills the correct arrays in index with their relevent data. 
   It looks at the /html, /css, /js, /media folders, and readir file 
   for files to serve, and automatically adds their path and url for 
   serving on the webpage. It uses their order in the file system to 
   create the url, so you don't have to worry about writing the url 
   yourself. It is automatically handled! 
*/
function initIndex(){
	/* 
	   This adds the html files for serving in our html folder. 
	   serv is the url we are serving to, and path is the path 
	   of the file that we are serving. 
	*/
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
	
	/* 
	   This adds the css files for serving in our css folder. 
	   serv is the url we are serving to, and path is the path 
	   of the file that we are serving.
	*/
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
	
	/* 
	   This adds the js files for serving in our js folder. 
	   serv is the url we are serving to, and path is the path 
	   of the file that we are serving.
	*/
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
	
	/* 
	   This adds the js files for serving in our js folder. 
	   serv is the url we are serving to, and path is the path 
	   of the file that we are serving.
	*/
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
	
	/* 
	    This reads a file and creates a bunch of urls to redirect 
	    users similar to Windows host file. 
	*/
	fs.readFile(__dirname + "/reddir", "utf8", function(err, res){
		var data = res.split("\n");
		for(let i in data){
			data[i] = data[i].replace(/\s+/g, " ");
			index.reddir.push({from: ""+data[i].split(" ")[0].trim(), to: ""+data[i].split(" ")[1].trim() });
		}
		//console.table(index.reddir);
	});
	
	/* 
	   This adds the api files that we run when a user accesses 
	   a url in our api folder. serv is the url we are serving 
	   to, and path is the path of the file that we are serving. 
	   All of these files must have a main funtion that accepts 
	   a request and a response from the server, and ends the 
	   connection after doing whatever their job is. 
	*/
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

/* This helps add all the html files into index.html */
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

/* This helps add all the css files into index.css */
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

/* This helps add all the js files into index.js */
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

/* This helps add all the media files into index.media */
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

/* This helps add all the api js files into index.api */
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

/* This takes a request, and returns a promise with the relevent JSON. */
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

/* This is the actual server that does all of the work. */
const server = http.createServer(function(req, res){
	
	/* If this is never set to true, then we serve a 404. */
	var triggered = false;
	
	/* 
	   This looks at the url, and sees if it is contained 
	   inside of index.html. If it is, it serves the 
	   relevent webpage. 
	*/
	var pathname = url.parse(req.url).pathname;
	for(let i in index.html){
		if("/"+index.html[i].serv == pathname){
			triggered = true;
			res.statusCode = 200;
			res.setHeader("Content-Type", "text/html");
			res.end(fs.readFileSync(index.html[i].path));
		}
	}
	/* 
	   This looks at the url, and sees if it is contained 
	   inside of index.css. If it is, it serves the 
	   relevent css file. 
	*/
	for(let i in index.css){
		if("/"+index.css[i].serv == pathname){
			triggered = true;
			res.statusCode = 200;
			res.setHeader("Content-Type", "text/css");
			res.end(fs.readFileSync(index.css[i].path));
		}
	}
	/* 
	   This looks at the url, and sees if it is contained 
	   inside of index.js. If it is, it serves the 
	   relevent js file. 
	*/
	for(let i in index.js){
		if("/"+index.js[i].serv == pathname){
			triggered = true;
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/javascript");
			res.end(fs.readFileSync(index.js[i].path));
		}
	}
	/* 
	   This looks at the url, and sees if it is contained 
	   inside of index.media. If it is, it serves the 
	   relevent media file. 
	*/
	for(let i in index.media){
		if("/"+index.media[i].serv == pathname){
			triggered = true;
			res.statusCode = 200;
			res.end(fs.readFileSync(index.media[i].path));
		}
	}
	/* 
	   This looks at the url, and sees if it is contained 
	   inside of index.reddir. If it is, it reddirects 
	   users to the correct webpage. 
	*/
	for(let i in index.reddir){
		if(index.reddir[i].from == pathname){
			triggered = true;
			res.writeHead(302, {Location: index.reddir[i].to.trim()});
			res.end();
		}
	}
	/* 
	   This looks at the url, and sees if it is contained 
	   inside of index.api. If it is, and the request type 
	   in post, it runs the relevent api js file's main
	   function. 
	*/
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
	
	/* This servers a criminally basic 404 page. */
	if(!triggered){
		res.end("<h1>404: Sorry, but we couldn't find that page.</h1>");
	}
});

/* Now we actually run the server. */
server.listen(port, function(){
	console.log("Server hosted on port " + port);
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
