Graph Server
============

Graph Server is a minimal proof-of-concept demonstrating a mesh network using WebRTC. Only Chrome is supported. 

Working demo: www.TheVeryWedge.com

Usage
-----

By connecting to site, you become a named `Nexus` in the mesh network. Other nexus are listed by name on the front page. Try opening up the page in two browser tabs. 

Nexus in the graph can can publish named javascript objects. Try  this syntax in the Chrome console:

    console.log('My name is', nexus.get("name"));
    // logs "My name is dog"
    nexus.set("About", "Man's Best Friend!");
    // the nexus named 'dog' now has a resource named 'About'

To request a resource from a nexus, you need to know the nexus' name. In an new browser tab, try the following in the console (replacing 'dog' with your target nexus name).

    nexus.send('dog',
      {
        event:'get',
        data:{resourceName:"name"}
      },
      function(result){console.log(result);}
    )

The function signature for Nexus.send is:

    Nexus.send(targetNexusName, eventObject, callback)

Events
------

When you send a resource request to a nexus, you are actually triggering an event on that nexus. That event will be passed the 'data' attribute of the `event` object.

Every nexus in consructed with `ping`, `get`, and `getResourceList` event listeners. Use `nexus.on('eventName', callback)` to register additional events. Note that these events will be callable by other Nexus in the mesh. Only the result of the FIRST callback to be registered will be returned to remote nexus. 

To launch:
----------

    $ sudo npm install -g forever  

edit and execute `./serve.bash`
