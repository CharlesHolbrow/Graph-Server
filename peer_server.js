var PeerServer  = require('peer').PeerServer;
var Handlebars  = require('handlebars');
var fs          = require('fs');

var exServe = require('express')();
var template = fs.readFileSync('public/index.html', {encoding: 'utf8'});

exServe.get('/', function(req, res){
  res.send('Try this - /:name/to/:target');
});

exServe.get('/:name/to/:target', function(req, res){
  res.send(template);
});

console.log("launching express server on 9001")
exServe.listen("9001");

console.log("launch peer server on 9000");
var server = new PeerServer({ port: 9000 });

console.log('Script Complete');
