app.directive('online', function(socketService) {
  return {
    restrict: 'E',
    templateUrl: 'online.html',
    link: function($scope, el, attrs) {
      var _this = this;
      $scope.online = [];
      socketService.getOnlineList();
      socketService.on('chat-history', function(data) {
        $scope.online = data || [];
        return $scope.$apply();
      });
      socketService.on('online', function(data) {
        $scope.online.push(data);
        return $scope.$apply();
      });
      return socketService.on('offline', function(id) {
        _.remove($scope.online, function(online) {
          return id === online.id;
        });
        return $scope.$apply();
      });
    }
  };
});
