var PeerServer  = require('peer').PeerServer;
var Handlebars  = require('handlebars');
var fs          = require('fs');
var Nexus       = require('./public/js/Nexus.js');
var express     = require('express')

var exServe = express();
var source = fs.readFileSync('public/index.html', {encoding: 'utf8'});
var template = Handlebars.compile(source);

var SIGNAL_PORT = process.env.SIGNAL_PORT;
var SIGNAL_HOST = process.env.SIGNAL_HOST;

// logging
var logFile = fs.createWriteStream('./logs/requests.log', {flags: 'a'});
exServe.use(express.logger({stream: logFile}));

// we will name the nodes on our graph
var nameIndex = 0;
var clientNames = [
  'ape', 'bat', 'cat', 'cow', 'cub', 'doe', 'dog', 'elk',
  'ewe', 'fox', 'kid', 'man', 'pig', 'pup', 'ram', 'rat',
  'sow'];

var getClientName = function() {
  var name = clientNames[nameIndex % clientNames.length];
  nameIndex++;
  if (nameIndex >= clientNames.length) name += nameIndex;
  return name;
};

// the server itself is a nexus
var nexus = Nexus.make('Server A!');

// serve static files
exServe.use(express.static(__dirname + '/public'));


exServe.get('/', function(req, res){
  res.send('Try this - /to/:target');
});

exServe.get('/friends', function(req, res){
  res.send(nexus.friends);
});

exServe.post('/join', function(req, res){
  var name = getClientName();
  res.json({
    name:name,
    friends:nexus.friends,
    signalHost: SIGNAL_HOST,
    signalPort: SIGNAL_PORT
  });

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

console.log("launch peer server on %s:%s", SIGNAL_HOST, SIGNAL_PORT);
var server = new PeerServer({ port: SIGNAL_PORT });

console.log('Servers are running');
