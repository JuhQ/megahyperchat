app.directive('online', function(socketService) {
  return {
    restrict: 'E',
    templateUrl: 'online.html',
    link: function($scope, el, attrs) {
      var i, _i,
        _this = this;
      $scope.online = [];
      socketService.on('online', function(data) {
        $scope.online.push(data);
        return $scope.$apply();
      });
      socketService.on('offline', function(data) {
        _.remove($scope.online, function(online) {
          return data.id === online.id;
        });
        return $scope.$apply();
      });
      for (i = _i = 1; _i <= 10; i = ++_i) {
        socketService.setOnline({
          name: "Random online " + (_.random(1, 200)),
          id: _.random(1, 200)
        });
      }
      setInterval(function() {
        return socketService.setOnline({
          name: "Random " + (_.random(1, 200)),
          id: _.random(1, 200)
        });
      }, 15000);
      return setInterval(function() {
        return socketService.setOffline(_.random(1, 200));
      }, 1500);
    }
  };
});
