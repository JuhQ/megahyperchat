app.controller('index', function($scope, socketService) {
  return $scope.getNumber = function(num) {
    return new Array(num);
  };
});
