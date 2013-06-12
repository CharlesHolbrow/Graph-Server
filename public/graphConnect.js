var peer;
var conn;
var nexus;

var onJoin = function() {
  if (this.status === 200) {

    var answer = JSON.parse(this.response); // assume valid json with .name
    console.log('JOINED!', answer);
    document.getElementById('name').innerHTML = answer.name;

    nexus = Nexus.make(answer.name);

    // we have a name. We may now alert the other nodes
    peer = new Peer(answer.name, {host: 'localhost', port: 9000});
    peer.on('connection', function(conn){
      conn.on('data', function(data) {
        console.log('Got data:', data);

        // if the incoming data is an event object with a return address
        // trigger the event on the nexus, and send back the result
        if (data.event && data.from) {

          var result = nexus.trigger(data);
          console.log('sending back <%s> to %s', JSON.stringify(result), data.from);

          conn = peer.connect(data.from);

          if (conn.open) {
            conn.send(result);
          } else {
            conn.on('open', function() {
              conn.send(nexus.trigger(data))
            });
          }
        }
      });
      conn.on('error', function(error) {
        console.error('Peer (incoming?) connection error:', error);
      });
    });

    // try to send a greeting to target node
    var target = document.getElementById('target').innerHTML;
    conn = peer.connect(target);

    conn.on('open', function() {
      conn.send({event:'ping', from: nexus.name});
    });
    conn.on('error', function(error){
      console.log('peer connection error:', error);
    });

  } else {
    console.error('Error joining graph', this);
  }
};


window.onload = function() {

  // let's try to join the graph
  var joinRequest = new XMLHttpRequest();
  joinRequest.onload = onJoin;

  joinRequest.open('POST', '/join', true);
  joinRequest.send();

};
