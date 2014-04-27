app.controller 'profile', ($scope, $stateParams, accountService) ->

  $scope.profile = accountService.get($stateParams.id)
