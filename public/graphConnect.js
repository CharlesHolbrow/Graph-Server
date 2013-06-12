window.onload = function() {
  var target = document.getElementById('target').innerHTML;
  var peer;
  var conn;
  var nexus;

  // let's try to join the graph
  var joinRequest = new XMLHttpRequest();
  joinRequest.onload = function() {
    if (this.status === 200) {

      var answer = JSON.parse(this.response); // assume valid json with .name
      console.log('JOINED!', answer);
      document.getElementById('name').innerHTML = answer.name;

      nexus = Nexus.make(answer.name);

      // we have a name, so we may now alert the other nodes
      peer = new Peer(answer.name, {host: 'localhost', port: 9000});
      peer.on('connection', function(conn){
        conn.on('data', function(data) {
          console.log('Got data:', data);
        });
      });

      // try to send a greeting to other nodes
      conn = peer.connect(target);
      conn.on('open', function() {
        conn.send('Hello from ' + nexus.name);
      });

    } else {
      console.error('Error joining graph', this);
    }
  };

  joinRequest.open('POST', '/join', true);
  joinRequest.send();

};