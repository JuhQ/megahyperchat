app.directive 'rate', ->
  restrict: 'E'
  templateUrl: 'rate.html'
  scope:
    profile: '='
  link: ($scope, el, attrs) ->

    $scope.getNumber = (num) ->
      new Array(num)

    $scope.vote = (star) ->
      points = Math.abs(5 - star)
