// Nodejs or Browser?
if (typeof module !== 'undefined' && module.exports) {
  var Backbone = require('backbone');
}

var Resource = Backbone.Model.extend({
  
});

// If node.js, export Resource;
if (typeof module !== 'undefined' && module.exports) {
  exports.Resource = Resource;
}
