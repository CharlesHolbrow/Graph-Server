var PeerServer  = require('peer').PeerServer;
var Handlebars  = require('handlebars');
var fs          = require('fs');
var Nexus       = require('./Nexus.js');

var exServe = require('express')();
var source = fs.readFileSync('public/index.html', {encoding: 'utf8'});
var template = Handlebars.compile(source)

exServe.get('/', function(req, res){
  res.send('Try this - /to/:target');
});

exServe.get('/Nexus.js', function(req, res){
  res.sendfile('./Nexus.js');
});

// we will name the nodes on our graph
var clientNames = ['ape', 'bat', 'cat', 'cow', 'cub', 'doe', 'dog', 'elk', 'ewe', 'fox', 'kid', 'man', 'pig', 'pup', 'ram', 'rat', 'sow'];
var nameIndex = 0;

var getClientName = function() {
  var name = clientNames[nameIndex];
  nameIndex++;
  if (nameIndex >= clientNames.length) {
    nameIndex = 0;
  }
  return name;
}

exServe.get('/to/:target', function(req, res){
  var pathDirs = req.url.split('/');
  var context = {
    name: getClientName(),
    target: pathDirs[2]
  };

  res.send(template(context));
});

console.log("launching express server on 9001");
exServe.listen("9001");

console.log("launch peer server on 9000");
var server = new PeerServer({ port: 9000 });

console.log('Script Complete');
