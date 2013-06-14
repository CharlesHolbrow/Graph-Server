BrowserNexus = {};

BrowserNexus.make = function(name) {
  var nexus = Nexus.make(name);
  var pendingConnections = {};
  var connections = {};
  var callbacks = {};

  var peer = new Peer(name, {host: 'localhost', port: 9000});
  peer.on('connection', function(conn){
    conn.on('data', function(data) {
      data.from = conn.peer; // overwrite 'from'
      receive(data);
    });
  });


  // -----------------------------------
  // private methods
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

  var connect = function(target, callback){
    var conn = peer.connect(target);
    pendingConnections[target] = conn;
    conn.on('open', function(){
      // when connection opens, move it out of pendingConnections
      connections[target] = conn;
      delete pendingConnections[target];
      callback && callback(conn);
    });
  }


  // -----------------------------------
  // Instance Methods
  nexus.debug = function() {
    console.log('connections:', connections);
    console.log('pendingConn:', pendingConnections);
    console.log('callbacks:', callbacks);
  }

  nexus.send = function(target, obj, callback) {
    if (callback) {
      obj.id = '' + Math.random();
      callbacks[obj.id] = callback;
    }

    // Connections should only contain 'open' connections.
    // If the object contains a closed connection, delete it.
    if (connections[target] && !connections[target].open) {
      delete connections[target]
    }

    pendingConnection = pendingConnections[target];
    if (pendingConnection){
      // if the connection has been created, but is not open
      pendingConnection.on('open', function(){
        pendingConnection.send(obj);
      });
    } else if (!connections[target]){
      // there is no connection, pending or otherwise
      connect(target, function(conn){
        conn.send(obj);
      });
    } else if (connections[target]){
      // we have an open connection
      connections[target].send(obj);
    }
  }

  return nexus;
};
