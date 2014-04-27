app.directive('chat', function(socketService, emojiService, accountService) {
  return {
    restrict: 'E',
    templateUrl: 'chat.html',
    link: function($scope, el, attrs) {
      var loggedInUser, scrollhere,
        _this = this;
      $scope.messages = [];
      $scope.from = false;
      $scope.emojis = emojiService.getList();
      scrollhere = document.getElementById("scrollhere");
      $scope.startsWith = function(state, viewValue) {
        return state.substr(0, viewValue.length) === viewValue;
      };
      loggedInUser = accountService.getLoggedIn();
      loggedInUser.$promise.then(function(data) {
        console.log("data", data);
        $scope.from = data;
        return socketService.setOnline(data);
      });
      socketService.on('message', function(data) {
        $scope.messages.push(data);
        $scope.$apply();
        return scrollhere != null ? scrollhere.scrollIntoView() : void 0;
      });
      return $scope.sendMessage = function() {
        if ($scope.from) {
          socketService.sendMessage({
            message: $scope.message,
            from: $scope.from
          });
          return $scope.message = '';
        }
      };
    }
  };
});
