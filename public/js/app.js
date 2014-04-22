var app;

app = angular.module('app', ['ui.router', 'ui.router.compat', 'ui.bootstrap']);

app.config(function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  return $stateProvider.state('index', {
    url: '/',
    templateUrl: 'index.html',
    controller: 'index'
  });
});

app.run();
