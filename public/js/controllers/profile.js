app.controller('profile', function($scope, $stateParams, accountService) {
  return $scope.profile = accountService.get($stateParams.id);
});
