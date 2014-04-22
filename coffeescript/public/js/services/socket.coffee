app.factory 'socketService', ->

  window.socket = window.socket || io.connect("http://#{window.location.host}")
  socket = window.socket

  sendMessage: (data) ->
    socket.emit 'message', data

  setOnline: (data) ->
    socket.emit 'online', data

  setOffline: (id) ->
    socket.emit 'offline', {id}

  on: (event, callback) ->
    socket.on event, callback

