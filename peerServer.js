var PeerServer  = require('peer').PeerServer;
var Handlebars  = require('handlebars');
var fs          = require('fs');
var NodeNexus   = require('./js/NodeNexus.js');
var express     = require('express')

var exServe = express();
var source = fs.readFileSync('public/index.html', {encoding: 'utf8'});
var template = Handlebars.compile(source);

var SIGNAL_PORT = process.env.SIGNAL_PORT;
var SIGNAL_HOST = process.env.SIGNAL_HOST;

// logging
var logFile = fs.createWriteStream('./logs/requests.log', {flags: 'a'});
exServe.use(express.logger({stream: logFile}));

// Parse json into object
exServe.use('/trigger', express.bodyParser());

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
var nexus = NodeNexus.make('Server A!');

// explicit routing
exServe.get('/', function(req, res){
  res.send('Try this - /to/:target');
});

// Equivalent of nexus.receive
exServe.post('/trigger', function(req, res){
  if (req.body.event) {
    req.body.ip = req.connection.remoteAddress;
    var result = nexus.trigger(req.body);
    res.json(201, result); // how do we decide what response code to send
  } else {
    res.send(from);
  }
});

nexus.on('join', function(data, from){
  var name = getClientName();
  return {
    name:name,
    signalHost: SIGNAL_HOST,
    signalPort: SIGNAL_PORT
  };
});

exServe.get('/to/:target', function(req, res){
  var pathDirs = req.url.split('/');
  var context = {
    target: pathDirs[2]
  };

  res.send(template(context));
});

// serve static files
exServe.use(express.static(__dirname + '/public'));

console.log("launching express server on 9001");
exServe.listen("9001");

console.log("launch peer server on %s:%s", SIGNAL_HOST, SIGNAL_PORT);
var server = new PeerServer({ port: SIGNAL_PORT });

console.log('Servers are running');
