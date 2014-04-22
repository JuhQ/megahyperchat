app.controller 'index', ($scope, socketService) ->

  $scope.getNumber = (num) ->
    new Array(num)
