app.directive('chat', function(socketService, emojiService) {
  return {
    restrict: 'E',
    templateUrl: 'chat.html',
    link: function($scope, el, attrs) {
      var fromRandom, randomUserId, scrollhere,
        _this = this;
      $scope.messages = [];
      $scope.emojis = emojiService.getList();
      scrollhere = document.getElementById("scrollhere");
      $scope.startsWith = function(state, viewValue) {
        return state.substr(0, viewValue.length) === viewValue;
      };
      randomUserId = _.random(1, 2000);
      socketService.setOnline({
        name: "Random " + randomUserId,
        id: randomUserId
      });
      fromRandom = function() {
        return {
          name: "random man " + randomUserId,
          id: randomUserId
        };
      };
      socketService.on('message', function(data) {
        $scope.messages.push(data);
        $scope.$apply();
        return scrollhere != null ? scrollhere.scrollIntoView() : void 0;
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
