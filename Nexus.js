/* Nexus.js

A nexus is one node in the node graph. Stores two important
dictionaries.

friends = {}
is a object containing truthy values for all known node
names in the graph.

resources = {} // TBD
is a collection of named resources. The object values are
arrays of friend names who have claim to have the resource
available. if a resource is in the collection, and the
corresponding node is in the friends object then we may
request the resource from the friend.

an exmple event object:
{
  event: "add", // required
  data: {
    ...
  }
}

*/

var Nexus = {}

Nexus.make = function(name) {
  var nexus = {};
  var events = {};
  nexus.name = name;
  nexus.friends = {};

  nexus.on = function(eventName, func) {
    events[eventName] = events[eventName] || [];
    events[eventName].push(func);
  };

  nexus.trigger = function(obj) {
    var eventList = events[obj.event];
    if (!eventList) return;

    var result;
    for (var i = eventList.length - 1; i >= 0; i--) {
      var check = eventList[i](obj.data);
      result = check || result;
    };

    return result; // Cation: returns only the first result
  };

  nexus.on('join', function(data) {
    if (!data.name) return;
    nexus.friends[data.name] = true;
  });

  nexus.on('ping', function() {
    return {name: nexus.name};
  })

  return nexus;
};


// Useable as a node module OR html
if (typeof exports !== 'undefined') {
  exports.make = Nexus.make;
};
