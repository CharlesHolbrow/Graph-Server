var onJoin = function(data, textStatus, jqXHR) {

  if (jqXHR.status >= 200 && jqXHR.status <= 202) {

    console.log('JOINED!', data);
    document.getElementById('name').innerHTML = data.name;

    window.nexus = BrowserNexus.make(
      data.name,
      data.signalHost,
      data.signalPort);

    $('textarea').bind('input propertychange', function() {
      nexus.set('profile', $('textarea').val());
    });

    // begin the heartbeat
    setInterval(function(){
      nexus.ajaxSend({
        event: 'get',
        data: {resourceName:'nodes'},
        from: data.name,
      }, function(obj){ // the event callback
        var $nodesUl = $('ul#nodes');
        var $nodes = $('li.node');
        // remove any nodes that are not in the new list
        for (var i = 0; i < $nodes.length; i++) {
          if (!obj.data[$nodes.eq(i).attr('name')]){ // is the node NOT in the new list?
            $('.node.' + $nodes.eq(i).attr('name')).remove(); // remove it
          }
        };

        // now add any nodes to the dom that are not there already
        for (name in obj.data) {
          if (!($('.' + name).length) && (name !== nexus.get('name'))){
            var $node = $('<li class="node">').addClass(name).html(name).attr('name', name);
            $node.click(function(){
              var $el = $(this);
              var name = $el.attr('name');
              nexus.send(name, {event:'getResourceList'}, function(obj){ // got resource list callback
                var resources = obj.data;
                $('[name=' +  name + '] span').remove();
                for (var i = 0; i < resources.length; i++) {
                  var resourceName = resources[i];
                  var $resource = $('<span class="resource">').html(resourceName);
                  $resource.click(function(){
                    var resourceName = $(this).html()
                    nexus.send(name, {event:'get', data:{resourceName:resourceName}}, function(obj){
                      $('#resource-data').html(obj.data);
                      console.log('resource data: ', obj);
                    })
                  });
                  $resource.appendTo($el);
                };
              });
            });
            $node.appendTo($nodesUl);
          }
        }
      })
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

// helper -- handy for passing in to 'send' methods from the console
window.debug = function(result){
  if (result) {
    console.log('result:', result);

    if (result.data) {
      console.log('data:', result.data);
      window.data = result.data;
    }
  }
}
