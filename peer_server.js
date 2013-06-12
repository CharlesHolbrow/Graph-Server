var PeerServer  = require('peer').PeerServer;
var Handlebars  = require('handlebars');
var fs          = require('fs');
var Nexus       = require('./Nexus.js');

var exServe = require('express')();
var source = fs.readFileSync('public/index.html', {encoding: 'utf8'});
var template = Handlebars.compile(source)

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
};

// the server itself is a nexus
var nexus = Nexus.make('Server A!');


exServe.get('/Nexus.js', function(req, res){
  res.sendfile('./Nexus.js');
});

exServe.get('/', function(req, res){
  res.send('Try this - /to/:target');
});

exServe.get('/friends', function(req, res){
  res.send(nexus.friends);
});

exServe.post('/join', function(req, res){
  var name = getClientName();
  res.json({name:name, friends:nexus.friends});

  nexus.trigger({
    event:'join',
    data:{ name:name }
  });
});


exServe.get('/to/:target', function(req, res){
  var pathDirs = req.url.split('/');
  var context = {
    target: pathDirs[2]
  };

  res.send(template(context));
});

console.log("launching express server on 9001");
exServe.listen("9001");

console.log("launch peer server on 9000");
var server = new PeerServer({ port: 9000 });

console.log('Script Complete');
