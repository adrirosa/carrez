// module leboncoin

 var http = require('http'),
 fs = require('fs'),
 request = require('request'),
 cheerio = require('cheerio'),
 express = require('express');
 var app = express();
 var port = 3000;
 var url = "https://www.leboncoin.fr/ventes_immobilieres/1025046562.htm?ca=12_s";

 module.exports.scrapper = function (url){
//parse the data
request(url, function(error, response, body) {
    if(error){ console.log("Error : " + error);}

    var $ = cheerio.load(body);

    var price = $('.item_price span.value');
    var priceText = price.text().trim();

    var city = $('.line_city span.value');
    var cityText = city.text().trim();

    var type = $('#adview > section > section > section.properties.lineNegative > div:nth-child(7) > h2 > span.value');
    var typeText = type.text().trim();

    var surface = $('#adview > section > section > section.properties.lineNegative > div:nth-child(9) > h2 > span.value');
    var surfaceText = parseInt(surface.text().trim());

    var good = {
     'price' : priceText.replace(new RegExp("[^(0-9)]", "g"), ''),
     'city' : cityText,
     'type' : typeText,
     'surface' : surfaceText,
 };
 console.log(good);
 return good;
});
}
