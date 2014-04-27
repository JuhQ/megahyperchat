app = angular.module('app', [
  'ui.router'
  'ui.router.compat'
  'ui.bootstrap'
  'ngResource'
])

app.config ($stateProvider, $locationProvider) ->
  $locationProvider.html5Mode(true)

  $stateProvider
    .state 'index',
      url: '/'
      templateUrl: 'index.html'
      controller: 'index'
    .state 'profile',
      url: '/profile/:id'
      templateUrl: 'profile.html'
      controller: 'profile'

    .state 'facebook_url_issue',
      url: '/_=_'
      controller: ->
        window.location.href = '/'

app.run()