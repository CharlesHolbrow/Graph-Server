BrowserNexus = {};

BrowserNexus.make = function(name) {
  var nexus = Nexus.make(name);
  var connections = {};
  var callbacks = {};

  var peer = new Peer(name, {host: 'localhost', port: 9000});
  peer.on('connection', function(conn){
    conn.on('data', function(data) {
      data.from = conn.peer; // overwrite 'from'
      receive(data);
    });
  });

  var receive = function(obj) {
    console.log('Got data: <%s> from %s', JSON.stringify(obj), obj.from);

    if (callbacks[obj.id]) {
      // if we have a callback with this id, assume the message is an answer
      // no event will be triggered
      callbacks[obj.id](obj); // consider using obj.data
      delete callbacks[obj.id];
    } else if (obj.event) {
      // if the object is an event, trigger it. 
      // if the obj contains an id, add this id to the results and send it back
      var result = nexus.trigger(obj) || {};
      if (obj.id && obj.from) {
        nexus.send(obj.from, {
          data:result,
          id: obj.id
        });
      }
    }
  }

  nexus.send = function(target, obj, callback) {
    if (callback) {
      obj.id = '' + Math.random();
      callbacks[obj.id] = callback;
    }
    var conn = connections[target];
    if (conn) {
      conn.send(obj);
    } else {
      console.warn('Could not send to %s. <Not Connected>', target);
    }
  }

  nexus.connect = function(target, callback) {
    var conn = peer.connect(target);
    conn.on('open', function(){
      connections[target] = conn;
      callback && callback(conn);
    });
  }

  return nexus;
};
