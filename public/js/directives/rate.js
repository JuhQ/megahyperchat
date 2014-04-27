app.directive('rate', function() {
  return {
    restrict: 'E',
    templateUrl: 'rate.html',
    scope: {
      profile: '='
    },
    link: function($scope, el, attrs) {
      $scope.getNumber = function(num) {
        return new Array(num);
      };
      return $scope.vote = function(star) {
        var points;
        return points = Math.abs(5 - star);
      };
    }
  };
});
