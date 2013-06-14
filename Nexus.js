/* Nexus.js

A nexus is one node in the node graph.

an exmple event object:
{
  event: "addRequest", // required
  id: "0.23497929383", // random number hopefully unique to the message
  data: {
    ... // this will be passed to the event
  }
}

*/

var Nexus = {}

Nexus.make = function(name) {
  var nexus = {};
  var events = {};
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
      var check = eventList[i](obj.data, obj.from);
      result = check || result;
    };

    return result; // Cation: returns only the first result
  };

  nexus.on('ping', function(obj, name) {
    console.log("%s pinged me!", name);
    return {name: nexus.name};
  })

  return nexus;
};


// Useable as a node module OR html
if (typeof exports !== 'undefined') {
  exports.make = Nexus.make;
};
