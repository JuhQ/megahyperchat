app = angular.module('app', [
  'ui.router'
  'ui.router.compat'
  'ui.bootstrap'
])

app.config ($stateProvider, $locationProvider) ->
  $locationProvider.html5Mode(true)

  $stateProvider
    .state 'index',
      url: '/'
      templateUrl: 'index.html'
      controller: 'index'

app.run()