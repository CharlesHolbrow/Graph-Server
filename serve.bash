#! /bin/bash

export SIGNAL_HOST='localhost'
export SIGNAL_PORT='9000'

forever start -e logs/error.log -o logs/debug.log peerServer.js
