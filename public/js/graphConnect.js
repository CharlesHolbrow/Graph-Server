var onJoin = function(data, textStatus, jqXHR) {

  if (jqXHR.status >= 200 && jqXHR.status <= 202) {

    console.log('JOINED!', data);
    document.getElementById('name').innerHTML = data.name;

    window.nexus = BrowserNexus.make(
      data.name,
      data.signalHost,
      data.signalPort);

    // try to send a greeting to target node
    var target = document.getElementById('target').innerHTML;

    nexus.send(target, {event:'ping'}, function(data) {
      console.log('Pinged %s and got back %s', target, JSON.stringify(data));
    });

    // begin the heartbeat
    setInterval(function(){
      $.post('/trigger', {
        event: 'ping',
        from: data.name,
      });
    }, 1000);

  } else { // not 200, 201, 202
    console.error('Error joining graph', jqXHR.status, jqXHR);
  }
};


window.onload = function() {

  $.post('/trigger', {
    event: 'join'
  }, onJoin);
};
