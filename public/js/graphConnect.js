var onJoin = function() {
  if (this.status >= 200 && this.status <= 202) {

    var answer = JSON.parse(this.response); // assume valid json with .name
    console.log('JOINED!', answer);
    document.getElementById('name').innerHTML = answer.name;

    window.nexus = BrowserNexus.make(
      answer.name,
      answer.signalHost,
      answer.signalPort);

    // try to send a greeting to target node
    var target = document.getElementById('target').innerHTML;

    nexus.send(target, {event:'ping'}, function(data) {
      console.log('Pinged %s and got back %s', target, JSON.stringify(data));
    });

  } else { // not 200, 201, 202
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
