BrowserNexus = {};

BrowserNexus.make = function(name, signalHost, signalPort) {
  var nexus = Nexus.make(name);
  var pendingConnections = {};
  var connections = {};
  var callbacks = {};

  var peer = new Peer(name, {host: signalHost, port: signalPort});
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

    // If a connection has closed since we added it to
    // connections, we do not want to try to send to it.
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

  // like send, but to the server. TODO: ajax and send should
  // be a single method.
  // Note that since there is currently only one server, the
  // function signature has only two arguments.
  nexus.ajaxSend = function(obj, callback){

    var jqCallback = function(data, textStatus, jqXHR){ // this function could be called nexus.ajaxReceive
      if (callback){
        callback({data:data, from:nexus.get('name')});
      }
    };

    $.post('/trigger', obj, jqCallback);
  };

  return nexus;
};
