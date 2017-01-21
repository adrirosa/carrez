var express = require('express');
var app = express();

console.log("Hello");
app.listen(3000);

app.get('/',function(request, response){
	response.send({name:"Lola", lastName:"Meron"});
});