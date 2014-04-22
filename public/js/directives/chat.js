app.directive('chat', function(socketService, emojiService) {
  return {
    restrict: 'E',
    templateUrl: 'chat.html',
    link: function($scope, el, attrs) {
      var fromRandom, i, _i,
        _this = this;
      $scope.messages = [];
      $scope.emojis = emojiService.getList();
      $scope.startsWith = function(state, viewValue) {
        return state.substr(0, viewValue.length) === viewValue;
      };
      fromRandom = function() {
        return {
          name: "random man " + (_.random(1, 2000)),
          id: _.random(1, 2000)
        };
      };
      for (i = _i = 0; _i <= 1; i = ++_i) {
        socketService.sendMessage({
          message: "hello world, random :curly_loop: message " + (_.random(1, 10000)),
          from: fromRandom()
        });
      }
      socketService.on('message', function(data) {
        $scope.messages.push(data);
        return $scope.$apply();
      });
      return $scope.sendMessage = function() {
        socketService.sendMessage({
          message: $scope.message,
          from: fromRandom()
        });
        return $scope.message = '';
      };
    }
  };
});
