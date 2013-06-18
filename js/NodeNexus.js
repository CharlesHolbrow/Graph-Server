var Nexus = require('../public/js/Nexus.js');

exports.make = function(name){
  var nexus = Nexus.make(name);

  // private vars
  var nodes = {}

  // TODO: ensure that the request is coming from the same ip
  nexus.recordInteraction = function(name, ip){
    nodes[name] = {
      ip:ip,
      time: new Date()
    }
  };

  nexus.logNodes = function(){
    console.log('---Nodes---')
    for (key in nodes){
      console.log(key, nodes[key]);
    }
  };

  return nexus;
}
