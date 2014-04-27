app.controller('index', function($scope) {
  return $scope.getNumber = function(num) {
    return new Array(num);
  };
});
