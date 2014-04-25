app.factory('socketService', function() {
  var socket;
  window.socket = window.socket ||  io.connect("http://" + window.location.host);
  socket = window.socket;
  return {
    sendMessage: function(data) {
      return socket.emit('message', data);
    },
    getOnlineList: function() {
      return socket.emit('load-chat-history');
    },
    setOnline: function(data) {
      return socket.emit('online', data);
    },
    setOffline: function(id) {
      return socket.emit('offline', {
        id: id
      });
    },
    on: function(event, callback) {
      return socket.on(event, callback);
    }
  };
});
