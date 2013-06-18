var Nexus = require('../public/js/Nexus.js');

exports.make = function(name) {
  nexus = Nexus.make(name);

  var connections = {};

  return nexus;
}
