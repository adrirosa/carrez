var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var good = require('./leboncoin.js');
var deal = require('./meilleursagents.js');

var app = express().use(express.static(__dirname+'/'));
var url = '';
var urlencodedParser = bodyParser.urlencoded({ extended: false});

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

app.post('/post',urlencodedParser, function(req,res){
	url = req.body.urlBonCoin;
 	//module leboncoin+meilleursagents
 	//res.send(the page with the result that u want to return)
 	var goodToCheck = good.scrapper(url);
 	console.log(goodToCheck);
 	goodToCheck = JSON.parse(goodToCheck);
 	
 	var urlMA = defineURL(goodToCheck);
 	var pricesCity = deal.scrapMA(urlMA);

 	var realEstate = calculDeal(goodToCheck,pricesCity);
 	res.send(url);
 	//console.log(url);
 	//res.render('index-success',{urlBonCoin: req.body});
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
		result = "You'll better look away...";
	} else {
		result = "That's a good deal ! Don't let it go !"
	}
	console.log(result);
	return result;
}

/*
** Function to define the url of meilleursagents.com according to the city
*/
function defineURL(goodToCheck){
	var urlDefined = "https://www.meilleursagents.com/prix-immobilier/";
	var cityName = goodToCheck.city.replace(new RegExp("[^(a-zA-Z0-9\-)]", "g"), '-');
	
	cityName = cityName.toLowerCase();
	urlDefined += cityName;

	return urlDefined;
}


// recup url
// utilisation de la fonction scrapper du module leboncoin
// une fois scrapper : defineURL du module meilleursagents
// scrapMA : scrap des données de meilleursagents
// deal : definir si c'est un bond deal
// renvoyer les results sur la page HTML

console.log("Hello");
app.listen(3000);