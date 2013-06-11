var Nexus = {}

Nexus.make = function() {
  var nexus = {};
  nexus.friends = [];
  return nexus;
};

// Useable as a node module OR html
if (typeof exports !== 'undefined') {
  exports.make = Nexus.make;
};
