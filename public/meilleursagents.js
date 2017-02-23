//module meilleuragents.com

var http = require('http'),
fs = require('fs'),
request = require('request'),
cheerio = require('cheerio'),
express = require('express');
var app = express();
var port = 3000;

/*
** Function to scrap the average prices of a specific url of meilleursagent.com
*/
function scrapMA(url){
	var prices = {
		'AvgPriceApt' : '',
		'AvgPriceHouse' :''
	};
	request(url, function(error, response, body) {
		if(error){ 
			console.log("Error : " + error);}
			var $ = cheerio.load(body);

			var aptAvg = $('#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(2) > div.small-4.medium-2.columns.prices-summary__cell--median');
			var aptAvgText = aptAvg.text().trim();

			var houseAvg = $('#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(3) > div.small-4.medium-2.columns.prices-summary__cell--median');
			var houseAvgText = houseAvg.text().trim();

			//JSON of string
			prices = {
				'AvgPriceApt' : aptAvgText.replace(new RegExp("[^(0-9)]", "g"), ''),
				'AvgPriceHouse' : houseAvgText.replace(new RegExp("[^(0-9)]", "g"), '')
			};

			console.log(prices);
		});
	return prices;
};


exports.scrapMA = scrapMA;