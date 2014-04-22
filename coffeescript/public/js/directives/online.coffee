app.directive 'online', (socketService) ->
  restrict: 'E'
  templateUrl: 'online.html'
  link: ($scope, el, attrs) ->
    $scope.online = []

    socketService.on 'online', (data) =>
      $scope.online.push data
      $scope.$apply()


    socketService.on 'offline', (data) =>
      _.remove $scope.online, (online) ->
        data.id is online.id
      $scope.$apply()


    for i in [1..10]
      socketService.setOnline {name: "Random online #{_.random(1,200)}", id: _.random(1,200)}

    setInterval ->
      socketService.setOnline {name: "Random #{_.random(1,200)}", id: _.random(1,200)}
    , 15000


    setInterval ->
      socketService.setOffline _.random(1,200)
    , 1500
