// mongod --dbpath /data/dbを先に行う！！

//rm /data/db/mongod.lock 

// ログ
// /usr/local/var/log/mongodb/mongo.log

//ターミナルから
//検索 db.getCollection("galleries").find()

var mongoose = require('mongoose');
var http = require('http');
var qs = require('querystring');
var cb = [];
var db, Gallery;
var Schema = mongoose.Schema;
/*var UserSchema = new Schema({
  color:  String,
  user: String,
  like: Number,
  comment: String
});*/
var BtnSchema = new Schema({
  html:  String,
  css: String,
  time: Date,
  watch: Number,
  like: Number,
  twitter_id: Number,
  twitter_name: String,
  screen_name: String,
  location: String,
  description: String,
  url: String,
  lang: String,
  img: String,
  likers: []
});
mongoose.model('Gallery', BtnSchema);
 
http.createServer(function (request, response) {
	var body = "";
  	request.on("data", function (data) {body+=data})
  	request.on("end", function () {
	  	response.writeHead(200, {'Content-Type': 'application/json'});
	    var urlinfo = require('url').parse( request.url );
	    //console.log( urlinfo );
	    //console.log(`body:${body}`);
	    var POST = qs.parse(body);
        //console.log(POST);
	    if(urlinfo.pathname === "/find") {
	    	find(response, POST);
	    } else if (urlinfo.pathname === "/insert") {
	    	insert(response, POST);
	    } else if (urlinfo.pathname === "/like") {
	    	addLike(response, POST);
	    }
	  	
  	})
}).listen(3000);

console.log('Server running at http://localhost:3000/');

function init () {
	db = mongoose.createConnection();
	db.open('mongodb://localhost:27017/button')
	Gallery = db.model('Gallery');
}

function find (response, post) {
	init()
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		cb = []
		Gallery.find({}, function(err, docs) {
			if (err) throw err;
			for (var i=0, size=docs.length; i<size; i++) {
				//console.log(docs[i]);
				cb.push(docs[i])
			}
			response.end(JSON.stringify(cb));
			//process.on('SIGINT', function() { mongoose.disconnect(); });
			//db.connection.close();
		});
	});	
}

function insert (response, post) {
	init();
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var btn = new Gallery()
		for (var i in post) {
			btn[i] = post[i];
		}
		btn.save(function(err) {
			if (err) { console.log(err); }
		});
		response.end(JSON.stringify(btn));
	});
}

function addLike (response, post) {
	//console.log(post)
	init();
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		Gallery.findOne({_id:post.id}, function(err, docs) {
			if (err) throw err;
			console.log(docs)
			if(docs.likers.indexOf(post.screen_name) === -1 && Number(post.increment) > 0) {
				docs.likers.push(post.screen_name)
			}else{
				for(var i=0; i<docs.likers.length; i++) {
					if(docs.likers[i] === post.screen_name) {
						docs.likers.splice(i,1)
					}
				}
			}
			docs.like += Number(post.increment)
			docs.save(function () {
				if (err) { console.log(err); }
				console.log("------------- complete ------------")
				response.end(JSON.stringify(docs));
			})
			
		});
	});
}









function dumydatapush(gly) {
  var n = 10
  var names = ["Hidetaro7", "Chihiro", "Chikuwa"]
  while(n--) {
	var btn = new gly()
	btn.user = names[Math.floor(Math.random() * names.length)]
	btn.like = Math.floor(Math.random()*100)
	btn.comment = "Hello!!! " + btn.user;
	btn.save(function(err) {
		if (err) { console.log(err); }
	});
  }
}












