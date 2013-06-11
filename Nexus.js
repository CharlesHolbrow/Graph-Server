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

events = {} // TBD


*/

var Nexus = {}

Nexus.make = function(name) {
  var nexus = {};
  nexus.name = name;
  nexus.friends = {};
  return nexus;
};

// Useable as a node module OR html
if (typeof exports !== 'undefined') {
  exports.make = Nexus.make;
};
