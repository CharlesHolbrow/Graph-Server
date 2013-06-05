var PeerServer  = require('peer').PeerServer;
var Handlebars  = require('handlebars');
var fs          = require('fs');

var exServe = require('express')();
var source = fs.readFileSync('public/index.html', {encoding: 'utf8'});
var template = Handlebars.compile(source)

exServe.get('/', function(req, res){
  res.send('Try this - /:name/to/:target');
});

exServe.get('/:name/to/:target', function(req, res){
  var pathDirs = req.url.split('/');
  var context = {
    name: pathDirs[1],
    target: pathDirs[3]
  };

  res.send(template(context));
});

console.log("launching express server on 9001");
exServe.listen("9001");

console.log("launch peer server on 9000");
var server = new PeerServer({ port: 9000 });

console.log('Script Complete');
