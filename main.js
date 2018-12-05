const http = require("http");
const url = require("url");

const consoleTable = require("console.table");

const fs = require("fs");

var host = "localhost";

var index = {
	html:	[],
	css:	[],
	js: 	[],
	media: 	[],
	readdir:[]
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

const server = http.createServer(function(req, res){
	var pathname = url.parse(req.url).pathname;
	for(let i in index.html){
		if("/"+index.html[i].serv == pathname){
			res.statusCode = 200;
			res.setHeader("Content-Type", "text/html");
			res.end(fs.readFileSync(index.html[i].path));
		}
	}
	for(let i in index.css){
		if("/"+index.css[i].serv == pathname){
			res.statusCode = 200;
			res.setHeader("Content-Type", "text/css");
			res.end(fs.readFileSync(index.css[i].path));
		}
	}
	for(let i in index.js){
		if("/"+index.js[i].serv == pathname){
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/javascript");
			res.end(fs.readFileSync(index.js[i].path));
		}
	}
	for(let i in index.media){
		if("/"+index.media[i].serv == pathname){
			res.statusCode = 200;
			res.end(fs.readFileSync(index.media[i].path));
		}
	}
	for(let i in index.readdir){
		if(index.readdir[i].from == pathname){
			res.writeHead(302, {Location: index.readdir[i].to.trim()});
			res.end();
		}
	}
	res.end("<h1>404: Sorry, but we couldn't find that page.</h1>");
});

server.listen(80, host, function(){
	
});
