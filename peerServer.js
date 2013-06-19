var PeerServer  = require('peer').PeerServer;
var Handlebars  = require('handlebars');
var fs          = require('fs');
var NodeNexus   = require('./js/NodeNexus.js');
var express     = require('express')

var exServe = express();

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

// route
exServe.get('/', function(req, res){
  res.sendfile('public/index.html');
});

// Equivalent of nexus.receive
exServe.post('/trigger', function(req, res){
  if (req.body.event) {
    var obj = req.body;
    obj.data = obj.data || {};
    obj.remoteAddress = req.connection.remoteAddress;

    if (obj.from) {
      nexus.recordInteraction(obj.from, obj.remoteAddress);
    }

    var result = nexus.trigger(obj);
    res.json(201, result); // how do we decide what response code to send

  } else {
    res.send(404, 'POST to Trigger - Error: no event');
  }
});

// TODO: we should move this to BrowserNexus, but how do we send the signal host and signal port?
nexus.on('join', function(obj){
  var name = getClientName();
  nexus.recordInteraction(name, obj.remoteAddress);

  return {
    name:name,
    signalHost: SIGNAL_HOST,
    signalPort: SIGNAL_PORT
  };
});


// serve static files
exServe.use(express.static(__dirname + '/public'));

console.log("launching express server on 9001");
exServe.listen("9001");

console.log("launch peer server on %s:%s", SIGNAL_HOST, SIGNAL_PORT);
var server = new PeerServer({ port: SIGNAL_PORT });

console.log('Servers are running');
