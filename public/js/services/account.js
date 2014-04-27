app.factory('accountService', function($resource) {
  return {
    get: function(id) {
      return $resource('/api/profile/:id').get({
        id: id
      });
    },
    getLoggedIn: function() {
      return $resource('/api/loggedin').get();
    }
  };
});
