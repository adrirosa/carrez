//module meilleuragents.com

var http = require('http'),
fs = require('fs'),
request = require('request'),
cheerio = require('cheerio'),
express = require('express'),
good = require('./leboncoin.js');
var app = express();
var port = 3000;
var url = "https://www.leboncoin.fr/ventes_immobilieres/1025046562.htm?ca=12_s";

//var urlMA = "https://www.meilleursagents.com/prix-immobilier/paris-75000/";

/*
** Function to scrap the average prices of a specific url of meilleursagent.com
*/
function scrapMA(url){
	request(url, function(error, response, body) {
		if(error){ 
			console.log("Error : " + error);}
			var $ = cheerio.load(body);

			var aptAvg = $('#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(2) > div.small-4.medium-2.columns.prices-summary__cell--median');
			var aptAvgText = aptAvg.text().trim();

			var houseAvg = $('#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(3) > div.small-4.medium-2.columns.prices-summary__cell--median');
			var houseAvgText = houseAvg.text().trim();

			//JSON of string
			var prices = {
				'AvgPriceApt' : aptAvgText.replace(new RegExp("[^(0-9)]", "g"), ''),
				'AvgPriceHouse' : houseAvgText.replace(new RegExp("[^(0-9)]", "g"), ''),
			};

			console.log(prices);})
}

/*
** Function which calculate the price per m2 and define if it is a good deal
** We conclude that it is a good deal if the price per m2 is fewer to the
**   average one in this city.
*/  
function deal(goodToCheck){
	var priceAvg = 0;
	var result = '';
	var pricePerM2 = parseInt(goodToCheck.price) / parseInt(goodToCheck.surface); //string to int


	if(good.type == "Appartement"){
		priceAvg = prices.AvgPriceApt;
	} else {
		priceAvg = prices.AvgPriceHouse;
	}

	if(pricePerM2 == priceAvg || pricePerM2 > priceAvg) {
		result = "You'll better look away...";
	} else {
		result = "That's a good deal ! Don't let it go !"
	}
	return result;
}

/*
** Function to define the url of meilleursagents.com according to the city
*/
function defineURL(goodToCheck){
	var urlDefined = "https://www.meilleursagents.com/prix-immobilier/";
	var cityName = goodToCheck.city.replace(new RegExp("[^(a-zA-Z0-9\-)]", "g"), '-');
	var cityNumber = parseInt(goodToCheck.city);
	
	cityName = cityName.toLowerCase();
	urlDefined += cityName;
	urlDefined += '-';
	urlDefined += cityNumber+'/';
}

var goodToCheck = good.scrapper(url);
var urlMA = defineURL(goodToCheck);
scrapMA(urlMA);


//exports.scrapMA = scrapMA;