/* Nexus.js

A nexus is one node in the node graph.

an exmple event object:
{
  event: "addRequest", // required
  id: "0.23497929383", // random number hopefully unique to the message
  from: "<node name>", // must be added automatically by send method
  data: {
    ... // this will be passed to the event
  }
}

I would like to make Nexus Backbone model
*/

// check if we are in node
if (typeof module !== 'undefined' && module.exports){
  var Resource = require('./Resource.js');
};


var Nexus = {}

Nexus.make = function(name) {
  var nexus = {};
  var events = {};
  var resources = {};
  nexus.name = name;

  nexus.on = function(eventName, func) {
    events[eventName] = events[eventName] || [];
    events[eventName].push(func);
  };

  nexus.trigger = function(obj) {
    var eventList = events[obj.event];
    if (!eventList) return;

    var result;
    for (var i = eventList.length - 1; i >= 0; i--) {
      var check = eventList[i].call(nexus, obj.data);
      result = check || result;
    };

    return result; // Caution: returns only the first result
  };

  // event listeners
  nexus.on('ping', function(data){
    return {name: nexus.name};
  });

  nexus.on('getResourceList', function(data){
    return Object.keys(resources);
  });

  return nexus;
};


// Useable as a node module OR html
if (typeof exports !== 'undefined') {
  exports.make = Nexus.make;
};
