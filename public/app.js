var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var good = require('./leboncoin');
var deal = require('./meilleursagents');

var app = express().use(express.static(__dirname+'/'));
var url = "";
var urlencodedParser = bodyParser.urlencoded({ extended: false});

var goodToCheck = "";
var urlMA ="";
var pricesCity = "";
var realEstate = "";

app.set('port', process.env.PORT || 3000);
//app.set('view engine', 'ejs');
//app.engine('.html', require('ejs').renderFile());

http.createServer( function (req, res){
	res.writeHead(200);
	res.end();
});

app.get('/',function(req, res){
	res.sendFile(__dirname + '/index.html');
	res.render('index');
});

var callback1 = function(err, goodToCheck){
	if(err) {throw err;}
	goodToCheck = JSON.parse(goodToCheck);
	urlMA = defineURL(goodToCheck);
};

var callback2 = function(err, goodToCheck, pricesCity){
	if(err) {throw err;}
	realEstate = calculDeal(goodToCheck,pricesCity);
	console.log(realEstate);
};

var scrapLBC = function(good, url, callback){
	goodToCheck = good.scrapper(url);
	callback(null, goodToCheck);
};

var calcul = function(deal, urlMA, callback){
	pricesCity = deal.scrapMA(urlMA);
	callback(null, goodToCheck, pricesCity);
};

app.post('/post',urlencodedParser, function(req,res){
	url = req.body.urlBonCoin;
 	scrapLBC(good, url, callback1);
 	calcul(deal,urlMA,callback2);
 	res.send('/post',realEstate);
 });

/*
** Function which calculate the price per m2 and define if it is a good deal
** We conclude that it is a good deal if the price per m2 is fewer to the
**   average one in this city.
*/  
function calculDeal(goodToCheck,pricesCity){
	var priceAvg = 0;
	var result = '';
	var pricePerM2 = parseInt(goodToCheck.price) / parseInt(goodToCheck.surface); //string to int
	var delta = 0;
	var deltaPourc = 0;

	if(goodToCheck.type == "Appartement"){
		priceAvg = pricesCity.AvgPriceApt;
	} else if( goodToCheck.type == "Maison") {
		priceAvg = pricesCity.AvgPriceHouse;
	} else {
		result = 'error'
		console.log(result);
		return result;
	}


	if(pricePerM2 >= priceAvg) {
		delta = pricePerM2 - priceAvg;
	} else {
		delta = priceAvg - pricePerM2;
	}

	deltaPourc = (delta * 100)/priceAvg;
	if(deltaPourc > 30){
		result = "You'll better look away...";
	} else {
		result = "That's a good deal ! Don't let it go !";
	}

	console.log(result);
	return result;
};

/*
** Function to define the url of meilleursagents.com according to the city
*/
function defineURL(goodToCheck){
	var urlDefined = "https://www.meilleursagents.com/prix-immobilier/";
	var cityName = goodToCheck.city.replace(new RegExp("[^(a-zA-Z0-9\-)]", "g"), '-');
	
	cityName = cityName.toLowerCase();
	urlDefined += cityName;

	return urlDefined;
};


// recup url
// utilisation de la fonction scrapper du module leboncoin
// une fois scrapper : defineURL du module meilleursagents
// scrapMA : scrap des données de meilleursagents
// deal : definir si c'est un bond deal
// renvoyer les results sur la page HTML

console.log("Hello");
app.listen(3000);