var Nexus = require('../public/js/Nexus.js');

exports.make = function(name){
  var nexus = Nexus.make(name);

  // private vars
  var nodes = {}
  nexus.set('nodes', nodes);

  // TODO: ensure that the request is coming from the same ip
  nexus.recordInteraction = function(name, ip){
    nodes[name] = {
      ip:ip,
      time: new Date()
    }
  };

  // remove any nodes we have not seen in a while
  nexus.purgeNodes = function(tolerance){
    var delta;
    var lostNodeNames = [];
    tolerance = tolerance || 2000;
    time = new Date();

    // find all dead node names
    for (name in nodes){
      delta = time - nodes[name].time;
      if (delta > tolerance){
        lostNodeNames.push(name);
      }
    }

    // remove all dead nodes
    for (var i = 0; i < lostNodeNames.length; i++) {
      delete nodes[lostNodeNames[i]];
      console.log('removing dead node:', lostNodeNames[i]);
    };
  }

  nexus.logNodes = function(){
    console.log('---Nodes---')
    for (key in nodes){
      console.log(key, nodes[key]);
    }
  };

  // remove dead nodes every 2.5 seconds
  setInterval(nexus.purgeNodes, 2500);

  return nexus;
}
