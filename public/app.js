var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var good = require('./leboncoin.js');

var app = express().use(express.static(__dirname+'/'));
var url = '';
var urlencodedParser = bodyParser.urlencoded({ extended: false});

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.engine('.html', require('ejs').renderFile());

http.createServer( function (req, res){
	res.writeHead(200);
  		res.end();
 	});

app.get('/',function(req, res){
	res.sendFile(__dirname + '/index.html');
	res.render('index');
});

app.post('/index.html',urlencodedParser, function(req,res){
 	/*req.on('urlBonCoin', function(data){
 	url += data.toString();
 	res.send(url);
 	res.end();
 	});*/
 	console.log(req.body);
 	res.render('index-success',{urlBonCoin: req.body});
});

//good(url);
console.log("Hello");
app.listen(3000);